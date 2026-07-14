import { useSyncExternalStore } from "react";

export type UserRole = "recruiter" | "candidate";

export type AppSettings = {
  fullName: string;
  email: string;
  jobTitle: string;
  role: UserRole;
  timezone: string;
  emailNotifications: boolean;
  productUpdates: boolean;
  compactMode: boolean;
};

const KEY = "aihire.profile.v2";
const EMPTY: AppSettings = {
  fullName: "",
  email: "",
  jobTitle: "",
  role: "candidate",
  timezone:
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  emailNotifications: true,
  productUpdates: true,
  compactMode: false,
};

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

if (typeof window !== "undefined") {
  cache = read();
}

/** True when the user has filled in a basic profile. */
export function hasProfile(s: AppSettings = cache) {
  return Boolean(s.fullName && s.email);
}
