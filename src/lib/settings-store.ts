import { useSyncExternalStore } from "react";

export type AppSettings = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  groqApiKey: string;
};

const KEY = "aihire.settings.v1";
const EMPTY: AppSettings = { supabaseUrl: "", supabaseAnonKey: "", groqApiKey: "" };

const listeners = new Set<() => void>();
let cache: AppSettings = EMPTY;

function read(): AppSettings {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getSettings(): AppSettings {
  return cache;
}

export function saveSettings(next: Partial<AppSettings>) {
  cache = { ...cache, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getServerSnapshot(): AppSettings {
  return EMPTY;
}

export function useSettings(): AppSettings {
  return useSyncExternalStore(subscribe, () => cache, getServerSnapshot);
}

// Hydrate cache on client
if (typeof window !== "undefined") {
  cache = read();
}

export function hasSupabaseConfig(s: AppSettings = cache) {
  return Boolean(s.supabaseUrl && s.supabaseAnonKey);
}
