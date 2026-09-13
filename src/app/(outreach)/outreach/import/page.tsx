import { isSupabaseConfigured } from "@/lib/outreach/supabase-server";
import NotConfigured from "@/components/outreach/NotConfigured";
import ImportClient from "@/components/outreach/ImportClient";

export default function ImportPage() {
  if (!isSupabaseConfigured()) return <NotConfigured />;
  return <ImportClient />;
}
