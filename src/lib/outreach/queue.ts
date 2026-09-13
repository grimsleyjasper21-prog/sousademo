import "server-only";
import { getSupabaseServer } from "./supabase-server";
import type { Batch, Lead } from "./types";

const MADRID_TZ = "Europe/Madrid";

/** Today's date (YYYY-MM-DD) in Europe/Madrid, independent of server TZ. */
export function madridToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function madridDateOf(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoTimestamp));
}

/** Current month name + year, e.g. "September 2026", for default batch names. */
export function defaultBatchName(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MADRID_TZ,
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export async function getActiveBatch(): Promise<Batch | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Batch | null;
}

export interface TodayStats {
  sentToday: number;
  dailyTarget: number;
  monthSent: number;
  monthTotal: number;
  remaining: number;
  batch: Batch | null;
}

export async function getTodayStats(dailyTarget: number): Promise<TodayStats> {
  const supabase = getSupabaseServer();
  const batch = await getActiveBatch();

  if (!batch) {
    return { sentToday: 0, dailyTarget, monthSent: 0, monthTotal: 0, remaining: 0, batch: null };
  }

  const [{ count: monthSent }, { data: contactedRows }] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("batch_id", batch.id)
      .not("contacted_at", "is", null),
    supabase
      .from("leads")
      .select("contacted_at")
      .eq("batch_id", batch.id)
      .not("contacted_at", "is", null),
  ]);

  const today = madridToday();
  const sentToday =
    contactedRows?.filter((r) => r.contacted_at && madridDateOf(r.contacted_at) === today).length ?? 0;

  const total = batch.total_leads;
  const sent = monthSent ?? 0;

  return {
    sentToday,
    dailyTarget,
    monthSent: sent,
    monthTotal: total,
    remaining: Math.max(total - sent, 0),
    batch,
  };
}

/**
 * The queue is derived, not stored: the first N uncontacted leads (by
 * import_order) in the active batch. `limit` lets the UI ask for more once
 * the daily target is hit and the user chooses to continue.
 */
export async function getQueue(limit: number): Promise<{ batch: Batch | null; leads: Lead[] }> {
  const batch = await getActiveBatch();
  if (!batch) return { batch: null, leads: [] };

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("batch_id", batch.id)
    .eq("status", "uncontacted")
    .order("import_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return { batch, leads: (data as Lead[]) ?? [] };
}
