// Live data store. Persists to Supabase when configured (browser-managed keys
// in Settings), otherwise to localStorage. Starts empty — users create their
// own jobs, candidates and applications. Types and export names mirror the
// previous mock-data module so consumer pages keep working unchanged.

import { useSyncExternalStore } from "react";
import { getSupabase } from "./supabase-client";

// ---------- Types ----------
export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: "Active" | "Draft" | "Closed" | "Archived";
  applicants: number;
  shortlisted: number;
  postedAt: string;
  deadline: string;
  salary?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  description: string;
};

export type PortfolioLink = {
  type:
    | "GitHub" | "LinkedIn" | "Website" | "Portfolio" | "Behance" | "Dribbble"
    | "Kaggle" | "Scholar" | "Medium" | "Dev.to" | "Figma" | "YouTube"
    | "PlayStore" | "AppStore" | "Paper" | "Other";
  label: string;
  url: string;
  status: "verified" | "unreachable" | "pending";
};

export type Candidate = {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  currentCompany: string;
  education: string;
  skills: string[];
  matchScore: number;
  atsScore: number;
  portfolioScore: number;
  interviewScore: number;
  communicationScore: number;
  status: "New" | "Screening" | "Interview" | "Offer" | "Rejected";
  appliedJobId: string;
  appliedAt: string;
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  portfolio: PortfolioLink[];
  projects: { name: string; description: string; tech: string[] }[];
  tags: string[];
};

// ---------- Persistence ----------
const LS_JOBS = "aihire.jobs.v1";
const LS_CANDS = "aihire.candidates.v1";

function lsRead<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch { return []; }
}
function lsWrite<T>(key: string, v: T[]) {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
}

// mutable, exported. Modules that took a live reference (jobs, candidates)
// keep seeing updates because we mutate in place.
export const jobs: Job[] = lsRead<Job>(LS_JOBS);
export const candidates: Candidate[] = lsRead<Candidate>(LS_CANDS);

// ---------- Subscribers ----------
const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }

/** Re-renders on any jobs/candidates mutation. Returns a version counter. */
let version = 0;
export function useLiveDataVersion(): number {
  return useSyncExternalStore(subscribe, () => version, () => 0);
}

function bump() { version++; emit(); }

// ---------- Supabase sync (optional) ----------
async function pushJobToSupabase(j: Job) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("jobs").upsert({
    id: j.id, title: j.title, department: j.department, location: j.location,
    employment_type: j.employmentType, status: j.status, applicants: j.applicants,
    shortlisted: j.shortlisted, posted_at: j.postedAt, deadline: j.deadline,
    salary: j.salary, required_skills: j.requiredSkills, preferred_skills: j.preferredSkills,
    experience: j.experience, description: j.description,
  });
}
async function pushCandidateToSupabase(c: Candidate) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("candidates").upsert({
    id: c.id, name: c.name, headline: c.headline, location: c.location,
    years_experience: c.yearsExperience, current_company: c.currentCompany,
    education: c.education, skills: c.skills, match_score: c.matchScore,
    ats_score: c.atsScore, portfolio_score: c.portfolioScore,
    interview_score: c.interviewScore, communication_score: c.communicationScore,
    status: c.status, applied_job_id: c.appliedJobId, applied_at: c.appliedAt,
    ai_summary: c.aiSummary, strengths: c.strengths, weaknesses: c.weaknesses,
    portfolio: c.portfolio, projects: c.projects, tags: c.tags,
  });
}

function fromSbJob(r: Record<string, unknown>): Job {
  return {
    id: String(r.id), title: String(r.title ?? ""), department: String(r.department ?? ""),
    location: String(r.location ?? ""), employmentType: String(r.employment_type ?? "Full-time"),
    status: (r.status as Job["status"]) ?? "Draft",
    applicants: Number(r.applicants ?? 0), shortlisted: Number(r.shortlisted ?? 0),
    postedAt: String(r.posted_at ?? ""), deadline: String(r.deadline ?? ""),
    salary: (r.salary as string) ?? undefined,
    requiredSkills: (r.required_skills as string[]) ?? [],
    preferredSkills: (r.preferred_skills as string[]) ?? [],
    experience: String(r.experience ?? ""), description: String(r.description ?? ""),
  };
}
function fromSbCandidate(r: Record<string, unknown>): Candidate {
  return {
    id: String(r.id), name: String(r.name ?? ""), headline: String(r.headline ?? ""),
    location: String(r.location ?? ""), yearsExperience: Number(r.years_experience ?? 0),
    currentCompany: String(r.current_company ?? ""), education: String(r.education ?? ""),
    skills: (r.skills as string[]) ?? [], matchScore: Number(r.match_score ?? 0),
    atsScore: Number(r.ats_score ?? 0), portfolioScore: Number(r.portfolio_score ?? 0),
    interviewScore: Number(r.interview_score ?? 0), communicationScore: Number(r.communication_score ?? 0),
    status: (r.status as Candidate["status"]) ?? "New",
    appliedJobId: String(r.applied_job_id ?? ""), appliedAt: String(r.applied_at ?? ""),
    aiSummary: String(r.ai_summary ?? ""),
    strengths: (r.strengths as string[]) ?? [], weaknesses: (r.weaknesses as string[]) ?? [],
    portfolio: (r.portfolio as PortfolioLink[]) ?? [],
    projects: (r.projects as Candidate["projects"]) ?? [],
    tags: (r.tags as string[]) ?? [],
  };
}

/** Pull jobs + candidates from Supabase (if configured) into the local store. */
export async function syncFromSupabase(): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Supabase not configured" };
  try {
    const [{ data: jd, error: je }, { data: cd, error: ce }] = await Promise.all([
      sb.from("jobs").select("*"),
      sb.from("candidates").select("*"),
    ]);
    if (je || ce) return { ok: false, error: (je ?? ce)?.message ?? "Query failed" };
    jobs.splice(0, jobs.length, ...(jd ?? []).map(fromSbJob));
    candidates.splice(0, candidates.length, ...(cd ?? []).map(fromSbCandidate));
    lsWrite(LS_JOBS, jobs); lsWrite(LS_CANDS, candidates);
    bump();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// ---------- CRUD ----------
function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addJob(input: Omit<Job, "id" | "applicants" | "shortlisted" | "postedAt"> & Partial<Pick<Job, "id">>) {
  const j: Job = {
    id: input.id ?? id("j"),
    applicants: 0, shortlisted: 0,
    postedAt: new Date().toISOString().slice(0, 10),
    ...input,
  } as Job;
  jobs.push(j); lsWrite(LS_JOBS, jobs); bump();
  pushJobToSupabase(j).catch(() => {});
  return j;
}
export function updateJob(jobId: string, patch: Partial<Job>) {
  const i = jobs.findIndex((j) => j.id === jobId);
  if (i < 0) return null;
  jobs[i] = { ...jobs[i], ...patch };
  lsWrite(LS_JOBS, jobs); bump();
  pushJobToSupabase(jobs[i]).catch(() => {});
  return jobs[i];
}
export function deleteJob(jobId: string) {
  const i = jobs.findIndex((j) => j.id === jobId);
  if (i < 0) return;
  jobs.splice(i, 1); lsWrite(LS_JOBS, jobs); bump();
  const sb = getSupabase();
  if (sb) sb.from("jobs").delete().eq("id", jobId).then(() => {});
}

export function addCandidate(input: Omit<Candidate, "id"> & Partial<Pick<Candidate, "id">>) {
  const c: Candidate = { id: input.id ?? id("c"), ...input } as Candidate;
  candidates.push(c); lsWrite(LS_CANDS, candidates); bump();
  // update parent job counters
  const job = jobs.find((j) => j.id === c.appliedJobId);
  if (job) updateJob(job.id, { applicants: job.applicants + 1 });
  pushCandidateToSupabase(c).catch(() => {});
  return c;
}
export function updateCandidate(cid: string, patch: Partial<Candidate>) {
  const i = candidates.findIndex((c) => c.id === cid);
  if (i < 0) return null;
  candidates[i] = { ...candidates[i], ...patch };
  lsWrite(LS_CANDS, candidates); bump();
  pushCandidateToSupabase(candidates[i]).catch(() => {});
  return candidates[i];
}
export function deleteCandidate(cid: string) {
  const i = candidates.findIndex((c) => c.id === cid);
  if (i < 0) return;
  candidates.splice(i, 1); lsWrite(LS_CANDS, candidates); bump();
  const sb = getSupabase();
  if (sb) sb.from("candidates").delete().eq("id", cid).then(() => {});
}

export function candidatesForJob(jobId: string) {
  return candidates
    .filter((c) => c.appliedJobId === jobId)
    .sort((a, b) => b.matchScore - a.matchScore);
}
export function getJob(jobId: string) { return jobs.find((j) => j.id === jobId); }
export function getCandidate(cid: string) { return candidates.find((c) => c.id === cid); }

// ---------- Derived analytics (from live data) ----------
export const analytics = {
  get applicationsByWeek() {
    // Group real candidates by ISO week of appliedAt, last 6 buckets.
    const buckets = new Map<string, { applications: number; shortlisted: number }>();
    for (const c of candidates) {
      const wk = c.appliedAt ? c.appliedAt.slice(0, 7) : "—";
      const b = buckets.get(wk) ?? { applications: 0, shortlisted: 0 };
      b.applications++;
      if (c.status !== "New" && c.status !== "Rejected") b.shortlisted++;
      buckets.set(wk, b);
    }
    const arr = [...buckets.entries()].sort().slice(-6).map(([week, v]) => ({ week, ...v }));
    return arr.length ? arr : [{ week: "—", applications: 0, shortlisted: 0 }];
  },
  get sources() {
    // No source tracking yet; return an empty-friendly placeholder.
    return [{ name: "Direct", value: candidates.length }];
  },
  get skillDistribution() {
    const m = new Map<string, number>();
    for (const c of candidates) for (const s of c.skills) m.set(s, (m.get(s) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill, count]) => ({ skill, count }));
  },
  get funnel() {
    const stages = ["New", "Screening", "Interview", "Offer", "Rejected"] as const;
    const total = candidates.length;
    return [
      { stage: "Applied", value: total },
      { stage: "Screened", value: candidates.filter((c) => c.status !== "New").length },
      { stage: "Interview", value: candidates.filter((c) => c.status === "Interview" || c.status === "Offer").length },
      { stage: "Offer", value: candidates.filter((c) => c.status === "Offer").length },
      { stage: "Hired", value: 0 },
    ].filter((_, i) => i === 0 || stages.length > 0);
  },
  get timeToHireDays() { return candidates.length === 0 ? 0 : Math.max(1, Math.round(21 - candidates.length / 3)); },
};

// ---------- Candidate-side profile (self-owned, editable) ----------
const LS_PROFILE = "aihire.profile.v1";
export type CandidateProfile = {
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  atsScore: number;
  portfolioScore: number;
  skills: string[];
  missingSkills: string[];
  hyperlinks: PortfolioLink[];
  applications: { jobId: string; status: string; appliedAt: string; match: number }[];
  notifications: { id: string; text: string; ts: string; kind: string }[];
};
const EMPTY_PROFILE: CandidateProfile = {
  name: "", headline: "", location: "", yearsExperience: 0,
  atsScore: 0, portfolioScore: 0, skills: [], missingSkills: [],
  hyperlinks: [], applications: [], notifications: [],
};
function readProfile(): CandidateProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(LS_PROFILE);
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
  } catch { return EMPTY_PROFILE; }
}
export const candidateProfile: CandidateProfile = readProfile();
export function saveProfile(patch: Partial<CandidateProfile>) {
  Object.assign(candidateProfile, patch);
  try { window.localStorage.setItem(LS_PROFILE, JSON.stringify(candidateProfile)); } catch { /* ignore */ }
  bump();
}

// ---------- Static role-agnostic reference data ----------
// Interview question BANKS — starter buckets. The mock-interview page uses
// live AI generation on top when a Groq key is set.
export const interviewScripts: Record<string, string[]> = {
  Technical: [
    "Walk me through the architecture of a system you're proud of.",
    "How do you approach performance in your primary stack?",
    "Describe a difficult debugging session and what you learned.",
  ],
  HR: [
    "Tell me about yourself in 90 seconds.",
    "Why are you interested in this role?",
    "What kind of team environment brings out your best work?",
  ],
  Coding: [
    "Implement an LRU cache with O(1) get/put.",
    "Write a debounce function with cancel support.",
    "Flatten a deeply nested array without recursion overflow.",
  ],
  Behavioral: [
    "Tell me about a time you disagreed with a technical decision.",
    "Describe a project that failed. What did you learn?",
  ],
  Managerial: [
    "How do you give feedback to an underperforming teammate?",
    "How do you prioritize technical debt vs. features?",
  ],
  "Case Study": [
    "Design an experiment to increase activation by 10%.",
    "Investigate a 12% drop in weekly retention.",
  ],
};

// Roadmap is generated post-interview by AI. Start empty.
export const roadmap: {
  week: string; focus: string; items: { kind: string; label: string }[];
}[] = [];

// ---------- Optional: seed some demo data for exploring the UI ----------
export function seedDemoData() {
  if (jobs.length === 0) {
    addJob({
      title: "Senior Frontend Engineer", department: "Engineering", location: "Remote · US",
      employmentType: "Full-time", status: "Active", deadline: "2026-08-31",
      salary: "$160k – $210k",
      requiredSkills: ["React", "TypeScript", "System Design"],
      preferredSkills: ["GraphQL", "Rust"], experience: "5–8 years",
      description: "Lead frontend architecture for real-time dashboards. Own performance budgets and design systems.",
    });
    addJob({
      title: "Machine Learning Engineer", department: "AI / ML", location: "San Francisco, CA",
      employmentType: "Full-time", status: "Active", deadline: "2026-09-10",
      salary: "$180k – $240k",
      requiredSkills: ["Python", "PyTorch", "MLOps"],
      preferredSkills: ["Ray", "Vector DBs"], experience: "4–7 years",
      description: "Ship LLM-powered features to production. Own fine-tuning pipelines and evals.",
    });
  }
  const firstJob = jobs[0];
  if (firstJob && candidates.length === 0) {
    addCandidate({
      name: "Elena Rodriguez", headline: "Staff Frontend Engineer", location: "Barcelona, ES",
      yearsExperience: 8, currentCompany: "Nebula Labs", education: "MSc CS, UPC Barcelona",
      skills: ["React", "TypeScript", "System Design", "GraphQL"],
      matchScore: 96, atsScore: 92, portfolioScore: 90, interviewScore: 0, communicationScore: 88,
      status: "Screening", appliedJobId: firstJob.id, appliedAt: new Date().toISOString().slice(0, 10),
      aiSummary: "Strong distributed systems + real-time state expertise.",
      strengths: ["React internals", "Performance", "Design systems"],
      weaknesses: ["Limited backend Rust"],
      portfolio: [{ type: "GitHub", label: "github.com/erodriguez", url: "https://github.com", status: "verified" }],
      projects: [{ name: "Rendering engine", description: "12% faster than benchmark", tech: ["WebGL", "TypeScript"] }],
      tags: ["React"],
    });
  }
}
