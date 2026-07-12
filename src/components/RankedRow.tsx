import { Link } from "@tanstack/react-router";
import type { Candidate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function RankedRow({ rank, c }: { rank: number; c: Candidate }) {
  const initials = c.name.split(" ").map((n) => n[0]).join("");
  const accent = rank === 1 ? "border-l-brand-success" : "border-l-brand-accent";

  return (
    <Link
      to="/recruiter/candidates/$id"
      params={{ id: c.id }}
      className={cn(
        "flex items-center justify-between gap-4 p-4 bg-brand-surface border border-brand-border border-l-4 rounded-r-xl hover:border-brand-accent/60 transition-colors",
        accent,
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="grid place-items-center h-10 w-10 rounded-full bg-brand-bg border border-brand-border font-mono text-sm text-brand-accent tabular-nums">
          {String(rank).padStart(2, "0")}
        </div>
        <div className="h-10 w-10 rounded-full bg-brand-accent/15 grid place-items-center text-brand-accent text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">{c.name}</div>
          <div className="text-xs text-muted-foreground font-mono truncate">
            {c.headline} · {c.yearsExperience}y · {c.location}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex gap-1.5">
          {c.tags.map((t) => (
            <span key={t} className="text-[10px] rounded bg-brand-bg border border-brand-border px-2 py-1 uppercase tracking-wider text-slate-300">
              {t}
            </span>
          ))}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold font-mono text-white tabular-nums">{c.matchScore}%</div>
          <div className="mono-label !text-[9px]">match</div>
        </div>
      </div>
    </Link>
  );
}
