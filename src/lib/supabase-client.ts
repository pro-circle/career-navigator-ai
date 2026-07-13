import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSettings } from "./settings-store";

let cached: { url: string; key: string; client: SupabaseClient } | null = null;

/** Returns a browser-managed Supabase client using keys stored in localStorage. */
export function getSupabase(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = getSettings();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (cached && cached.url === supabaseUrl && cached.key === supabaseAnonKey) {
    return cached.client;
  }
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, storageKey: "aihire.sb.auth" },
  });
  cached = { url: supabaseUrl, key: supabaseAnonKey, client };
  return client;
}

export function hasSupabase(): boolean {
  return getSupabase() !== null;
}
