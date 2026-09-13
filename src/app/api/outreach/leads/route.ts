import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 200;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") ?? "";
  const contactedOnly = url.searchParams.get("contactedOnly") === "true";
  const limit = Math.min(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1000);

  const supabase = getSupabaseServer();
  let query = supabase
    .from("leads")
    .select("*, batches(name)")
    .order(contactedOnly ? "contacted_at" : "import_order", { ascending: contactedOnly ? false : true })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }
  if (contactedOnly) {
    query = query.not("contacted_at", "is", null);
  }
  if (q) {
    const like = `%${q.replace(/[%_]/g, "")}%`;
    query = query.or(
      `business_name.ilike.${like},phone.ilike.${like},normalized_phone.ilike.${like},city.ilike.${like}`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ leads: data ?? [] });
}
