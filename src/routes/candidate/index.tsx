import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Bell, Sparkles } from "lucide-react";

import { PageHeader, Panel } from "@/components/AppShell";
import { AtsRadial, MatchBar } from "@/components/AtsRadial";
import { Button } from "@/components/ui/button";
import { candidateProfile, getJob } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/candidate/")({
  head: () => ({
    meta: [
      { title: "Candidate Dashboard — AIHire Pro" },
      { name: "description", content: "Your ATS score, applications, and next steps." },
    ],
  }),
  component: CandidateDashboard,
});

function CandidateDashboard() {
  return (
    <div>
      <PageHeader
        eyebrow={`Welcome back, ${candidateProfile.name.split(" ")[0]}`}
        title="Your application status"
        subtitle="ATS score, active applications, and the next step your AI coach recommends."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel eyebrow="AI Score" title="Resume compatibility" className="text-center">
          <div className="flex flex-col items-center">
            <AtsRadial score={candidateProfile.atsScore} accent="accent" />
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-6">
              Your resume matches <span className="text-white font-semibold">{candidateProfile.atsScore}%</span> of typical
              senior frontend job keywords. Focus on <span className="text-brand-warning">System Design</span> to move to 90+.
            </p>
            <Link to="/candidate/interview" className="mt-4 inline-flex">
              <Button className="gap-2">
                Start mock interview <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Panel>

        <Panel eyebrow="Applications" title="Active pipeline" className="lg:col-span-2">
          <div className="space-y-3">
            {candidateProfile.applications.map((a) => {
              const job = getJob(a.jobId);
              if (!job) return null;
              return (
                <div key={a.jobId} className="flex items-center gap-4 p-4 rounded-lg border border-brand-border bg-brand-bg">
                  <div className="h-10 w-10 rounded-lg bg-brand-accent/15 grid place-items-center text-brand-accent text-xs font-bold shrink-0">
                    {job.title
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{job.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {job.department} · {job.location} · applied {a.appliedAt}
                    </div>
                  </div>
                  <div className="hidden sm:block w-40">
                    <MatchBar label="Match" value={a.match} />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      a.status === "Interview"
                        ? "border-brand-success/30 text-brand-success bg-brand-success/10"
                        : "border-brand-border"
                    }
                  >
                    {a.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel eyebrow="Next Session" title="AI Mock Interview" className="lg:col-span-2">
          <div className="flex items-center gap-6">
            <div className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-accent/10 text-brand-accent">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Technical · System Design</div>
              <div className="text-xs text-muted-foreground mt-1">
                Tailored to Netflix Engineering culture. Adaptive follow-ups.
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <MatchBar value={33} label="Session 4 of 12" />
                </div>
                <Link to="/candidate/interview">
                  <Button size="sm">Launch AI Interviewer</Button>
                </Link>
              </div>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Notifications" title="Recent activity">
          <div className="space-y-3">
            {candidateProfile.notifications.map((n) => (
              <div key={n.id} className="flex gap-3 text-sm">
                <Bell className="h-3.5 w-3.5 mt-1 text-brand-accent shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 leading-snug">{n.text}</div>
                  <div className="mono-label !text-[10px] mt-1">{n.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
