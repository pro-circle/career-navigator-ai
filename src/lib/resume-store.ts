import { useSyncExternalStore } from "react";

const KEY = "aihire.resume.parsed.v1";

type Parsed = {
  fileName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  [k: string]: unknown;
};

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function getParsedResume(): Parsed | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Parsed) : null;
  } catch { return null; }
}

export function saveParsedResume(data: Parsed) {
  try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
  emit();
}

export function clearParsedResume() {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useParsedResume(): Parsed | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      const v = getParsedResume();
      // Stable reference per underlying JSON to avoid re-render loops
      return v;
    },
    () => null,
  );
}

export function useHasResume(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && !!window.localStorage.getItem(KEY)),
    () => false,
  );
}
