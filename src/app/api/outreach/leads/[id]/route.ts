import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/outreach/supabase-server";
import { LEAD_STATUSES } from "@/lib/outreach/types";

export const runtime = "nodejs";

const BodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("mark_sent") }),
  z.object({ action: z.literal("undo") }),
  z.object({ action: z.literal("edit_message"), message: z.string() }),
  z.object({ action: z.literal("set_status"), status: z.enum(LEAD_STATUSES) }),
]);

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const body = parsed.data;

  let update: Record<string, unknown>;
  switch (body.action) {
    case "mark_sent":
      update = { status: "sent", contacted_at: new Date().toISOString() };
      break;
    case "undo":
      update = { status: "uncontacted", contacted_at: null };
      break;
    case "edit_message":
      update = { message: body.message };
      break;
    case "set_status":
      update = { status: body.status };
      break;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead: data });
}
