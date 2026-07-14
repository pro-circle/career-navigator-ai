import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let cached: SupabaseClient | null = null;

/** Returns a Supabase client configured from .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (cached) return cached;
  cached = createClient(URL, ANON, {
    auth: { persistSession: true, storageKey: "aihire.sb.auth" },
  });
  return cached;
}

export function hasSupabase(): boolean {
  return Boolean(URL && ANON);
}
