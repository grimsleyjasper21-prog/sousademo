import { isSupabaseConfigured } from "@/lib/outreach/supabase-server";
import NotConfigured from "@/components/outreach/NotConfigured";
import LeadsClient from "@/components/outreach/LeadsClient";

export default function LeadsPage() {
  if (!isSupabaseConfigured()) return <NotConfigured />;
  return <LeadsClient />;
}
