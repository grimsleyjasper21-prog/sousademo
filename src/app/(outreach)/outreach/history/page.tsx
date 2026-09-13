import { isSupabaseConfigured } from "@/lib/outreach/supabase-server";
import NotConfigured from "@/components/outreach/NotConfigured";
import HistoryClient from "@/components/outreach/HistoryClient";

export default function HistoryPage() {
  if (!isSupabaseConfigured()) return <NotConfigured />;
  return <HistoryClient />;
}
