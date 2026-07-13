import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Briefcase, CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import { PageHeader, Panel, Stat } from "@/components/AppShell";
import { analytics, candidates, jobs, useLiveDataVersion } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/recruiter/")({
  head: () => ({
    meta: [
      { title: "Recruiter Dashboard — AIHire Pro" },
      { name: "description", content: "Pipeline overview, active jobs, and recent applicants." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  useLiveDataVersion();
  const activeJobs = jobs.filter((j) => j.status === "Active");
  const funnel = analytics.funnel;
  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.status !== "New").length;
  const interviews = candidates.filter((c) => c.status === "Interview").length;
  const offers = candidates.filter((c) => c.status === "Offer").length;


  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Recruiter Dashboard"
        subtitle="A live view of your pipeline, ranked applicants, and hiring velocity."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Active Jobs" value={activeJobs.length} hint="+2 this month" />
        <Stat label="Applications" value={492} hint="+58 this week" accent="accent" />
        <Stat label="Shortlisted" value={148} hint="30% conversion" accent="success" />
        <Stat label="Interviews" value={62} hint="Next 5 today" accent="warning" />
        <Stat label="Offers" value={18} hint="+3 this quarter" accent="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <Panel eyebrow="Pipeline" title="Hiring funnel" className="lg:col-span-2">
          <div className="space-y-3">
            {analytics.funnel.map((s, i) => {
              const max = analytics.funnel[0].value;
              const pct = (s.value / max) * 100;
              const colors = ["bg-brand-accent", "bg-brand-accent/80", "bg-brand-accent/60", "bg-brand-success/80", "bg-brand-success"];
              return (
                <div key={s.stage} className="grid grid-cols-[120px_1fr_60px] items-center gap-4 text-sm">
                  <span className="text-slate-300">{s.stage}</span>
                  <div className="h-8 bg-brand-bg rounded-lg overflow-hidden">
                    <div className={`h-full ${colors[i]} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-right font-mono text-white tabular-nums">{s.value}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-brand-border flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-brand-accent" />
              <span className="text-slate-400">Avg time to hire</span>
              <span className="text-white font-mono font-semibold">{analytics.timeToHireDays}d</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-brand-success" />
              <span className="text-slate-400">Offer acceptance</span>
              <span className="text-white font-mono font-semibold">78%</span>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Recent" title="Top applicants">
          <div className="space-y-3">
            {candidates.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/recruiter/candidates/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 p-3 rounded-lg border border-brand-border bg-brand-bg hover:border-brand-accent/50 transition"
              >
                <div className="h-9 w-9 rounded-full bg-brand-accent/15 grid place-items-center text-brand-accent font-semibold text-xs">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.headline}</div>
                </div>
                <span className="font-mono text-xs text-brand-accent">{c.matchScore}%</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel
          eyebrow="Open Roles"
          title="Active jobs"
          action={
            <Link to="/recruiter/jobs" className="text-xs text-brand-accent inline-flex items-center gap-1 font-medium">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeJobs.map((j) => (
              <Link
                key={j.id}
                to="/recruiter/jobs/$jobId"
                params={{ jobId: j.id }}
                className="group rounded-xl border border-brand-border bg-brand-bg p-5 hover:border-brand-accent/50 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="mono-label">{j.department}</div>
                    <div className="font-semibold text-white group-hover:text-brand-accent transition-colors mt-1">
                      {j.title}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-brand-success/30 text-brand-success bg-brand-success/10">
                    {j.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {j.applicants}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {j.shortlisted}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {j.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
