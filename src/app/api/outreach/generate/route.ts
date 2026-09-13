import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";
import { generateMessages, toGenerationInput } from "@/lib/outreach/ai";
import { getSettings } from "@/lib/outreach/settings";
import type { Lead } from "@/lib/outreach/types";

export const runtime = "nodejs";

const MAX_IDS_PER_REQUEST = 10;

const BodySchema = z.object({
  leadIds: z.array(z.string()).min(1).max(MAX_IDS_PER_REQUEST),
  variant: z.enum(["try_again", "more_casual", "more_direct"]).optional(),
  languageOverride: z.enum(["es", "en"]).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { leadIds, variant, languageOverride } = parsed.data;

  const supabase = getSupabaseServer();
  const [{ data: leads, error }, settings] = await Promise.all([
    supabase.from("leads").select("*").in("id", leadIds),
    getSettings(),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads || leads.length === 0) {
    return NextResponse.json({ succeeded: [], failedIds: leadIds });
  }

  const inputs = (leads as Lead[]).map(toGenerationInput);

  let succeeded: Awaited<ReturnType<typeof generateMessages>>["succeeded"] = [];
  try {
    const result = await generateMessages(inputs, settings, { variant, languageOverride });
    succeeded = result.succeeded;
  } catch {
    // Generation failed entirely for this chunk — every requested lead is
    // reported as failed below, nothing is written, nothing is lost.
    succeeded = [];
  }

  const now = new Date().toISOString();
  for (const msg of succeeded) {
    await supabase
      .from("leads")
      .update({ message: msg.message, message_language: msg.language, message_generated_at: now })
      .eq("id", msg.lead_id);
  }

  const succeededIds = new Set(succeeded.map((m) => m.lead_id));
  const failedIds = leadIds.filter((id) => !succeededIds.has(id));

  return NextResponse.json({ succeeded, failedIds });
}
