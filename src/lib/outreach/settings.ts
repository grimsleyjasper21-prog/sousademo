import "server-only";
import { getSupabaseServer } from "./supabase-server";
import type { Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    // Should always exist thanks to the migration seed row, but guard anyway.
    const fallback: Settings = {
      id: "default",
      daily_target: 30,
      language_mode: "auto",
      ai_context: "",
      base_instructions: "",
      updated_at: new Date().toISOString(),
    };
    return fallback;
  }
  return data as Settings;
}
