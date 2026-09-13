import { NextResponse } from "next/server";
import { getQueue, getTodayStats } from "@/lib/outreach/queue";
import { getSettings } from "@/lib/outreach/settings";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const settings = await getSettings();
  const url = new URL(request.url);
  const extra = Number(url.searchParams.get("extra") ?? 0) || 0;

  const limit = settings.daily_target + Math.max(extra, 0);

  const [{ batch, leads }, stats] = await Promise.all([
    getQueue(limit),
    getTodayStats(settings.daily_target),
  ]);

  return NextResponse.json({ batch, leads, stats });
}
