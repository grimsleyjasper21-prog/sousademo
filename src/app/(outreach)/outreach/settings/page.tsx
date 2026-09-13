import { getSettings } from "@/lib/outreach/settings";
import { isSupabaseConfigured } from "@/lib/outreach/supabase-server";
import NotConfigured from "@/components/outreach/NotConfigured";
import SettingsClient from "@/components/outreach/SettingsClient";

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) return <NotConfigured />;
  const settings = await getSettings();
  return <SettingsClient initialSettings={settings} />;
}
