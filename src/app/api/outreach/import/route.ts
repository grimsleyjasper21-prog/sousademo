import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";
import {
  buildColumnMap,
  extractRow,
  nameCityKey,
  parseOutscraperCsv,
  type ExtractedLead,
  type SkipReason,
} from "@/lib/outreach/csv-import";
import { defaultBatchName } from "@/lib/outreach/queue";

export const runtime = "nodejs";

interface NewLeadRow extends ExtractedLead {
  import_order: number;
}

const INSERT_CHUNK_SIZE = 200;

export async function POST(request: Request) {
  const supabase = getSupabaseServer();

  const formData = await request.formData();
  const file = formData.get("file");
  const batchNameInput = formData.get("batchName");
  const activateInput = formData.get("activate");

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No CSV file was uploaded." }, { status: 400 });
  }

  const rawText = await file.text();
  const fileText = rawText.charCodeAt(0) === 0xfeff ? rawText.slice(1) : rawText;

  const { headers, rows, parseErrorCount } = parseOutscraperCsv(fileText);
  if (headers.length === 0) {
    return NextResponse.json(
      { error: "Could not read any columns from this file. Is it a valid CSV export?" },
      { status: 400 }
    );
  }

  const columnMap = buildColumnMap(headers);

  // Existing leads across ALL batches, for cross-batch dedup.
  const { data: existingLeads, error: existingError } = await supabase
    .from("leads")
    .select("normalized_phone, business_name, city");
  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const seenPhones = new Set<string>();
  const seenNameCity = new Set<string>();
  for (const lead of existingLeads ?? []) {
    if (lead.normalized_phone) seenPhones.add(lead.normalized_phone);
    seenNameCity.add(nameCityKey(lead.business_name, lead.city));
  }

  const skipCounts: Record<SkipReason, number> = {
    missing_business_name: 0,
    missing_phone: 0,
    permanently_closed: 0,
    duplicate: 0,
  };

  const newLeads: NewLeadRow[] = [];
  let importOrder = 0;

  for (const row of rows) {
    const outcome = extractRow(row, columnMap);
    if (!outcome.kept) {
      skipCounts[outcome.reason]++;
      continue;
    }

    const { lead } = outcome;
    const nameCity = nameCityKey(lead.business_name, lead.city);

    if (seenPhones.has(lead.normalized_phone) || seenNameCity.has(nameCity)) {
      skipCounts.duplicate++;
      continue;
    }

    seenPhones.add(lead.normalized_phone);
    seenNameCity.add(nameCity);
    newLeads.push({ ...lead, import_order: importOrder++ });
  }

  const batchName =
    typeof batchNameInput === "string" && batchNameInput.trim()
      ? batchNameInput.trim()
      : defaultBatchName();
  const shouldActivate = activateInput !== "false";

  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .insert({ name: batchName, is_active: false, total_leads: newLeads.length })
    .select()
    .single();

  if (batchError || !batch) {
    return NextResponse.json(
      { error: batchError?.message ?? "Failed to create batch." },
      { status: 500 }
    );
  }

  let insertedCount = 0;
  let insertFailures = 0;

  for (let i = 0; i < newLeads.length; i += INSERT_CHUNK_SIZE) {
    const chunk = newLeads.slice(i, i + INSERT_CHUNK_SIZE).map((lead) => ({
      batch_id: batch.id,
      ...lead,
    }));

    const { error: chunkError, count } = await supabase
      .from("leads")
      .insert(chunk, { count: "exact" });

    if (!chunkError) {
      insertedCount += count ?? chunk.length;
      continue;
    }

    // A bad row shouldn't corrupt the whole import — retry the chunk one row
    // at a time so every valid row still lands.
    for (const row of chunk) {
      const { error: rowError } = await supabase.from("leads").insert(row);
      if (rowError) insertFailures++;
      else insertedCount++;
    }
  }

  if (insertedCount !== batch.total_leads) {
    await supabase.from("batches").update({ total_leads: insertedCount }).eq("id", batch.id);
  }

  if (shouldActivate) {
    await supabase.from("batches").update({ is_active: false }).eq("is_active", true);
    await supabase.from("batches").update({ is_active: true }).eq("id", batch.id);
  }

  return NextResponse.json({
    batch: { id: batch.id, name: batch.name, is_active: shouldActivate },
    summary: {
      rowsProcessed: rows.length,
      imported: insertedCount,
      duplicates: skipCounts.duplicate,
      invalid:
        skipCounts.missing_business_name + skipCounts.missing_phone + skipCounts.permanently_closed,
      invalidBreakdown: {
        missingBusinessName: skipCounts.missing_business_name,
        missingPhone: skipCounts.missing_phone,
        permanentlyClosed: skipCounts.permanently_closed,
      },
      malformedRows: parseErrorCount,
      insertFailures,
    },
  });
}
