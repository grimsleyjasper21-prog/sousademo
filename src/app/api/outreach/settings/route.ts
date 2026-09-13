import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";
import { getSettings } from "@/lib/outreach/settings";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

const BodySchema = z.object({
  daily_target: z.number().int().min(1).max(200).optional(),
  language_mode: z.enum(["auto", "es", "en"]).optional(),
  ai_context: z.string().optional(),
  base_instructions: z.string().optional(),
});

export async function PUT(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("settings")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", "default")
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}
