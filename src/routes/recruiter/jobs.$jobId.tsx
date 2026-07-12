import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Share2, Users, ExternalLink, Eye } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { PageHeader, Panel, Stat } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { candidatesForJob, getJob, analytics } from "@/lib/mock-data";
import { RankedRow } from "@/components/RankedRow";

export const Route = createFileRoute("/recruiter/jobs/$jobId")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.job.title} — AIHire Pro` : "Job — AIHire Pro" },
      {
        name: "description",
        content: loaderData ? `Details, post, applicants, and analytics for ${loaderData.job.title}.` : "Job detail",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
      <Link to="/recruiter/jobs" className="text-brand-accent">
        Back to jobs
      </Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-foreground">Something went wrong loading this job.</div>,
  component: JobDetail,
});

function JobDetail() {
  const { job } = Route.useLoaderData();
  const ranked = candidatesForJob(job.id);
  const top = ranked[0];

  return (
    <div>
      <PageHeader
        eyebrow={`Job · ${job.id}`}
        title={job.title}
        subtitle={`${job.department} · ${job.location} · ${job.employmentType}`}
        actions={
          <>
            <div className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-xs flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />
              {job.status} · {job.applicants} candidates
            </div>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Share link copied")}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </>
        }
      />

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-brand-surface border border-brand-border">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="applicants">Applicants · {ranked.length}</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid lg:grid-cols-3 gap-6">
            <Panel eyebrow="Requirements" title="Job details" className="lg:col-span-2">
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <SkillRow label="Required" skills={job.requiredSkills} accent />
                <SkillRow label="Preferred" skills={job.preferredSkills} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-brand-border text-xs">
                <div>
                  <div className="mono-label">Experience</div>
                  <div className="text-foreground mt-1">{job.experience}</div>
                </div>
                <div>
                  <div className="mono-label">Salary</div>
                  <div className="text-foreground mt-1">{job.salary ?? "—"}</div>
                </div>
                <div>
                  <div className="mono-label">Deadline</div>
                  <div className="text-foreground mt-1">{job.deadline}</div>
                </div>
              </div>
            </Panel>

            {top && (
              <Panel eyebrow="Top Match" title={top.name}>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{top.aiSummary}</p>
                <Link
                  to="/recruiter/candidates/$id"
                  params={{ id: top.id }}
                  className="text-xs text-brand-accent inline-flex items-center gap-1 font-medium"
                >
                  Open candidate profile <ExternalLink className="h-3 w-3" />
                </Link>
              </Panel>
            )}
          </div>
        </TabsContent>

        <TabsContent value="post">
          <Panel eyebrow="Public post" title="How candidates see this role" action={<Button size="sm" variant="outline" className="gap-2"><Eye className="h-3.5 w-3.5" /> Preview</Button>}>
            <article className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-foreground">{job.title}</h2>
              <div className="text-xs mono-label mb-4">
                {job.department} · {job.location} · {job.employmentType} · {job.salary ?? "Salary DOE"}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
              <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">Required qualifications</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {job.requiredSkills.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
              <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">Preferred</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {job.preferredSkills.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
              <div className="mt-6 pt-6 border-t border-brand-border flex gap-2">
                <Button onClick={() => toast.success("Published (mock)")}>Publish</Button>
                <Button variant="outline" onClick={() => toast.success("Link copied")}>Copy link</Button>
              </div>
            </article>
          </Panel>
        </TabsContent>

        <TabsContent value="applicants">
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            <Panel eyebrow="Ranked candidates" title={`${ranked.length} applicants · sorted by agent match`}>
              <div className="space-y-3">
                {ranked.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-brand-border p-8 text-center text-sm text-muted-foreground">
                    No applicants yet.
                  </div>
                ) : (
                  ranked.map((c, i) => <RankedRow key={c.id} rank={i + 1} c={c} />)
                )}
              </div>
            </Panel>

            <Panel eyebrow="Pipeline" title="Stage breakdown">
              <div className="space-y-2 text-sm">
                {(["New", "Screening", "Interview", "Offer", "Rejected"] as const).map((stage) => {
                  const count = ranked.filter((c) => c.status === stage).length;
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{stage}</span>
                      <Badge variant="outline" className="border-brand-border font-mono">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/recruiter/compare"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-brand-border bg-brand-bg py-2 text-xs hover:border-brand-accent transition"
              >
                <Users className="h-3.5 w-3.5" /> Compare candidates
              </Link>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat label="Applicants" value={job.applicants} hint="+8 this week" />
            <Stat label="Shortlisted" value={job.shortlisted} hint={`${Math.round((job.shortlisted / Math.max(1, job.applicants)) * 100)}% rate`} accent="success" />
            <Stat label="Interviews" value={ranked.filter((c) => c.status === "Interview").length} accent="warning" />
            <Stat label="Offers" value={ranked.filter((c) => c.status === "Offer").length} accent="success" />
          </div>
          <Panel eyebrow="Trend" title="Applications over time">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.applicationsByWeek}>
                  <defs>
                    <linearGradient id="jd1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: "#0a0f14", border: "1px solid #2D3748", borderRadius: 8, fontSize: 12, color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="var(--brand-accent)" fill="url(#jd1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SkillRow({ label, skills, accent }: { label: string; skills: string[]; accent?: boolean }) {
  return (
    <div>
      <div className="mono-label mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s}
            className={
              accent
                ? "text-[11px] rounded bg-brand-accent/10 text-brand-accent border border-brand-accent/30 px-2 py-0.5"
                : "text-[11px] rounded bg-brand-bg text-muted-foreground border border-brand-border px-2 py-0.5"
            }
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
