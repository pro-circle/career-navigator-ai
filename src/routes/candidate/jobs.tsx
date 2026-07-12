import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, MapPin, Briefcase } from "lucide-react";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MatchBar } from "@/components/AtsRadial";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate/jobs")({
  head: () => ({
    meta: [
      { title: "Job Match — AIHire Pro" },
      { name: "description", content: "Browse roles ranked by your personal AI match." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  // pseudo match scores per job
  const matches: Record<string, number> = { "j-4029": 84, "j-4030": 62, "j-4031": 41, "j-4032": 71, "j-4028": 78 };
  const active = jobs.filter((j) => j.status === "Active");
  const sorted = [...active].sort((a, b) => (matches[b.id] ?? 0) - (matches[a.id] ?? 0));
  const selected = jobs.find((j) => j.id === openId);

  return (
    <div>
      <PageHeader
        eyebrow="Discover"
        title="Roles matched to you"
        subtitle="AI ranks open roles against your resume, portfolio, and target career direction."
      />

      <div className="grid md:grid-cols-2 gap-4">
        {sorted.map((j) => {
          const match = matches[j.id] ?? 50;
          return (
            <div key={j.id} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="mono-label">{j.department}</div>
                  <div className="text-lg font-semibold text-white mt-1">{j.title}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {j.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {j.employmentType}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tabular-nums">{match}%</div>
                  <div className="mono-label !text-[10px]">match</div>
                </div>
              </div>
              <MatchBar value={match} />
              <div className="mt-3 flex flex-wrap gap-1">
                {j.requiredSkills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] rounded bg-brand-bg border border-brand-border px-2 py-0.5 uppercase tracking-wider text-slate-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <Button size="sm" variant="outline" onClick={() => setOpenId(j.id)} className="gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Match breakdown
                </Button>
                <Button size="sm" className="ml-auto">
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="sm:max-w-lg bg-brand-surface border-brand-border">
          <DialogHeader>
            <DialogTitle>{selected?.title} · Match breakdown</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <MatchBar label="Skill match" value={82} />
            <MatchBar label="Experience match" value={78} accent="success" />
            <MatchBar label="Education match" value={95} accent="success" />
            <MatchBar label="Portfolio relevance" value={71} />
            <MatchBar label="ATS readiness" value={84} accent="success" />
          </div>
          <div className="mt-4 rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-4 text-sm">
            <div className="mono-label text-brand-accent mb-1">AI Recommendation</div>
            <div className="text-slate-200">
              Apply — you meet the required-skill threshold. Boost portfolio to 85+ by adding a public system-design writeup.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
