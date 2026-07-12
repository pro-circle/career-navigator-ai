import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ExternalLink, Github, Linkedin, Globe, FileText, Youtube, PenTool } from "lucide-react";

import { PageHeader, Panel } from "@/components/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCandidate, getJob } from "@/lib/mock-data";
import { MatchBar } from "@/components/AtsRadial";
import type { Candidate, PortfolioLink } from "@/lib/mock-data";

export const Route = createFileRoute("/recruiter/candidates/$id")({
  loader: ({ params }) => {
    const candidate = getCandidate(params.id);
    if (!candidate) throw notFound();
    return { candidate };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.candidate.name} — AIHire Pro` : "Candidate — AIHire Pro" },
      { name: "description", content: "AI candidate summary, portfolio intelligence, and ranking rationale." },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Candidate not found</h1>
      <Link to="/recruiter/candidates" className="text-brand-accent">
        Back to candidates
      </Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-white">Something went wrong.</div>,
  component: CandidateDetail,
});

const linkIcon: Record<PortfolioLink["type"], React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Website: Globe,
  Portfolio: Globe,
  Behance: PenTool,
  Dribbble: PenTool,
  Kaggle: FileText,
  Scholar: FileText,
  Medium: FileText,
  "Dev.to": FileText,
  Figma: PenTool,
  YouTube: Youtube,
  PlayStore: Globe,
  AppStore: Globe,
  Paper: FileText,
  Other: Globe,
};

function CandidateDetail() {
  const { candidate: c } = Route.useLoaderData() as { candidate: Candidate };
  const job = getJob(c.appliedJobId);

  return (
    <div>
      <Link to="/recruiter/candidates" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="h-3 w-3" /> Back to candidates
      </Link>
      <PageHeader
        eyebrow={`Applied · ${job?.title ?? "—"}`}
        title={c.name}
        subtitle={`${c.headline} · ${c.currentCompany} · ${c.location} · ${c.yearsExperience}y`}
        actions={
          <>
            <Button variant="outline">Reject</Button>
            <Button className="gap-2">
              <Check className="h-4 w-4" /> Move to interview
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-brand-surface border border-brand-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio & Links</TabsTrigger>
              <TabsTrigger value="ranking">AI Ranking</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6 space-y-6">
              <Panel eyebrow="AI Summary" title="Recruiter briefing">
                <p className="text-sm text-slate-300 leading-relaxed">{c.aiSummary}</p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="mono-label mb-2 text-brand-success">Strengths</div>
                    <ul className="text-sm space-y-1.5">
                      {c.strengths.map((s) => (
                        <li key={s} className="text-slate-300 flex gap-2">
                          <Check className="h-3.5 w-3.5 mt-0.5 text-brand-success shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mono-label mb-2 text-brand-warning">Gaps</div>
                    <ul className="text-sm space-y-1.5">
                      {c.weaknesses.map((s) => (
                        <li key={s} className="text-slate-400">— {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>

              <Panel eyebrow="Projects" title="Highlighted work">
                <div className="grid sm:grid-cols-2 gap-3">
                  {c.projects.map((p) => (
                    <div key={p.name} className="rounded-lg border border-brand-border bg-brand-bg p-4">
                      <div className="font-semibold text-white text-sm">{p.name}</div>
                      <div className="mono-label !text-[10px] mt-0.5 text-brand-accent">{p.tech.join(" · ")}</div>
                      <div className="text-xs text-muted-foreground mt-2">{p.description}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="portfolio" className="pt-6">
              <Panel eyebrow="Portfolio Intelligence" title={`Portfolio Quality Score · ${c.portfolioScore}`}>
                <p className="text-sm text-muted-foreground mb-6">
                  Auto-detected professional links from the resume. Validation and content summaries run in the background.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {c.portfolio.map((l) => {
                    const Icon = linkIcon[l.type] ?? Globe;
                    return (
                      <a
                        key={l.url + l.label}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-lg border border-brand-border bg-brand-bg p-3 hover:border-brand-accent transition-colors"
                      >
                        <div className="h-9 w-9 rounded-lg bg-brand-surface grid place-items-center text-brand-accent shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs mono-label !text-[10px]">{l.type}</div>
                          <div className="text-sm text-white truncate">{l.label}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={
                              l.status === "verified"
                                ? "h-1.5 w-1.5 rounded-full bg-brand-success"
                                : l.status === "pending"
                                  ? "h-1.5 w-1.5 rounded-full bg-brand-warning"
                                  : "h-1.5 w-1.5 rounded-full bg-brand-danger"
                            }
                          />
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-accent" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="ranking" className="pt-6">
              <Panel eyebrow="Explainable AI" title="Why this rank?">
                <div className="space-y-3">
                  <MatchBar label="Semantic match" value={c.matchScore} />
                  <MatchBar label="ATS compatibility" value={c.atsScore} accent="success" />
                  <MatchBar label="Portfolio quality" value={c.portfolioScore} accent="success" />
                  <MatchBar label="Interview signal" value={c.interviewScore} />
                  <MatchBar label="Communication" value={c.communicationScore} accent="success" />
                </div>
                <div className="mt-6 pt-6 border-t border-brand-border">
                  <div className="mono-label mb-2">AI Rationale</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ranking is driven primarily by strong semantic overlap on required skills ({c.skills.slice(0, 3).join(", ")}
                    ), verified portfolio quality, and consistent communication signals. Weighting: 40% semantic · 20% ATS · 20%
                    portfolio · 20% interview.
                  </p>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="resume" className="pt-6">
              <Panel eyebrow="Resume" title="Parsed content">
                <div className="mono-label mb-2">Skills</div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {c.skills.map((s) => (
                    <Badge key={s} variant="outline" className="border-brand-border">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="mono-label mb-2">Education</div>
                <div className="text-sm text-slate-300">{c.education}</div>
              </Panel>
            </TabsContent>

            <TabsContent value="notes" className="pt-6">
              <Panel eyebrow="Collaboration" title="Interviewer notes">
                <div className="rounded-lg border border-dashed border-brand-border p-8 text-center text-sm text-muted-foreground">
                  No notes yet. Notes shared with hiring team will appear here.
                </div>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Panel eyebrow="Scores" title="AI ranking snapshot">
            <div className="space-y-3">
              <ScoreRow label="Match" value={c.matchScore} />
              <ScoreRow label="ATS" value={c.atsScore} />
              <ScoreRow label="Portfolio" value={c.portfolioScore} />
              <ScoreRow label="Interview" value={c.interviewScore} />
              <ScoreRow label="Communication" value={c.communicationScore} />
            </div>
          </Panel>

          <Panel eyebrow="Application" title="Details">
            <div className="text-sm space-y-2">
              <Row label="Status" value={c.status} />
              <Row label="Applied to" value={job?.title ?? "—"} />
              <Row label="Applied on" value={c.appliedAt} />
              <Row label="Experience" value={`${c.yearsExperience} years`} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-mono text-white tabular-nums">{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}
