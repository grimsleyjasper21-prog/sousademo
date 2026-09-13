import { getQueue, getTodayStats } from "@/lib/outreach/queue";
import { getSettings } from "@/lib/outreach/settings";
import { isSupabaseConfigured } from "@/lib/outreach/supabase-server";
import TodayClient from "@/components/outreach/TodayClient";
import NotConfigured from "@/components/outreach/NotConfigured";

export default async function TodayPage() {
  if (!isSupabaseConfigured()) return <NotConfigured />;

  const settings = await getSettings();
  const [{ batch, leads }, stats] = await Promise.all([
    getQueue(settings.daily_target),
    getTodayStats(settings.daily_target),
  ]);

  return (
    <TodayClient
      initialBatch={batch}
      initialLeads={leads}
      initialStats={stats}
      dailyTarget={settings.daily_target}
    />
  );
}
