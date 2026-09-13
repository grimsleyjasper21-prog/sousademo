import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ batches: data ?? [] });
}

const BodySchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  activate: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const supabase = getSupabaseServer();
  const { id, name, activate } = parsed.data;

  if (activate) {
    await supabase.from("batches").update({ is_active: false }).eq("is_active", true);
  }

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (activate !== undefined) update.is_active = activate;

  const { data, error } = await supabase
    .from("batches")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ batch: data });
}
