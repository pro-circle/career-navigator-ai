import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs, seedDemoData, useLiveDataVersion } from "@/lib/mock-data";

export const Route = createFileRoute("/recruiter/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — AIHire Pro" },
      { name: "description", content: "Manage open roles. Create jobs by filling out full role details." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  useLiveDataVersion();

  return (
    <div>
      <PageHeader
        eyebrow="Jobs"
        title="Open Roles"
        subtitle="Create, edit, and track every hiring pipeline. Click any role to see applicants, post, and analytics."
        actions={
          <Link to="/recruiter/jobs/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Job
            </Button>
          </Link>
        }
      />

      <Panel>
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-border p-10 text-center">
            <div className="mono-label mb-3">Empty pipeline</div>
            <h3 className="text-lg font-semibold text-foreground">No roles yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first job to start ranking applicants.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link to="/recruiter/jobs/new">
                <Button className="gap-2"><Plus className="h-4 w-4" /> New Job</Button>
              </Link>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  seedDemoData();
                  toast.success("Demo data loaded");
                }}
              >
                <Sparkles className="h-4 w-4" /> Load demo data
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left mono-label border-b border-brand-border">
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Applicants</th>
                  <th className="pb-3 pr-4">Shortlisted</th>
                  <th className="pb-3 pr-4">Deadline</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-brand-bg/40">
                    <td className="py-4 pr-4">
                      <Link
                        to="/recruiter/jobs/$jobId"
                        params={{ jobId: j.id }}
                        className="font-medium text-foreground hover:text-brand-accent"
                      >
                        {j.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">{j.location} · {j.employmentType}</div>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{j.department}</td>
                    <td className="py-4 pr-4 font-mono tabular-nums">{j.applicants}</td>
                    <td className="py-4 pr-4 font-mono tabular-nums text-brand-success">{j.shortlisted}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{j.deadline}</td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant="outline"
                        className={
                          j.status === "Active"
                            ? "border-brand-success/30 text-brand-success bg-brand-success/10"
                            : j.status === "Draft"
                              ? "border-brand-warning/30 text-brand-warning bg-brand-warning/10"
                              : "border-brand-border text-muted-foreground"
                        }
                      >
                        {j.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

