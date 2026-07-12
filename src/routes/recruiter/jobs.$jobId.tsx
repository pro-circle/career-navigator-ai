import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Share2, Users, ExternalLink } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { candidatesForJob, getJob } from "@/lib/mock-data";
import { RankedRow } from "@/components/RankedRow";
import { toast } from "sonner";

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
        content: loaderData ? `Ranked candidates and AI insights for ${loaderData.job.title}.` : "Job detail",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Job not found</h1>
      <Link to="/recruiter/jobs" className="text-brand-accent">
        Back to jobs
      </Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-white">Something went wrong loading this job.</div>,
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
              Active · {job.applicants} candidates
            </div>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Share link copied")}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Panel eyebrow="Ranked candidates" title={`${ranked.length} applicants · sorted by AI match`}>
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

          <Panel eyebrow="Requirements" title="Job details">
            <p className="text-sm text-slate-300 mb-4">{job.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <SkillRow label="Required" skills={job.requiredSkills} accent />
              <SkillRow label="Preferred" skills={job.preferredSkills} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-brand-border text-xs">
              <div>
                <div className="mono-label">Experience</div>
                <div className="text-white mt-1">{job.experience}</div>
              </div>
              <div>
                <div className="mono-label">Salary</div>
                <div className="text-white mt-1">{job.salary ?? "—"}</div>
              </div>
              <div>
                <div className="mono-label">Deadline</div>
                <div className="text-white mt-1">{job.deadline}</div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          {top && (
            <Panel eyebrow="AI Candidate Summary" title={top.name}>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{top.aiSummary}</p>
              <div className="mono-label mb-3">Portfolio Highlights</div>
              <div className="space-y-2">
                {top.projects.map((p) => (
                  <div key={p.name} className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                    <div className="text-xs font-semibold text-white">{p.name}</div>
                    <div className="text-[11px] text-brand-accent font-mono mt-0.5">{p.tech.join(" · ")}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{p.description}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border">
                <Link
                  to="/recruiter/candidates/$id"
                  params={{ id: top.id }}
                  className="text-xs text-brand-accent inline-flex items-center gap-1 font-medium"
                >
                  Open candidate profile <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </Panel>
          )}

          <Panel eyebrow="Pipeline" title="Stage breakdown">
            <div className="space-y-2 text-sm">
              {["New", "Screening", "Interview", "Offer", "Rejected"].map((stage) => {
                const count = ranked.filter((c) => c.status === stage).length;
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-slate-300">{stage}</span>
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
      </div>
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
                : "text-[11px] rounded bg-brand-bg text-slate-300 border border-brand-border px-2 py-0.5"
            }
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
