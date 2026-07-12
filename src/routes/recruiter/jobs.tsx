import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { jobs } from "@/lib/mock-data";
import { mockParseJd } from "@/lib/mock-ai";

export const Route = createFileRoute("/recruiter/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — AIHire Pro" },
      { name: "description", content: "Manage open roles. Create jobs by pasting a JD or uploading a file." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Jobs"
        title="Open Roles"
        subtitle="Create, edit, and track every hiring pipeline."
        actions={<NewJobDialog />}
      />

      <Panel>
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
                      className="font-medium text-white hover:text-brand-accent"
                    >
                      {j.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">{j.location} · {j.employmentType}</div>
                  </td>
                  <td className="py-4 pr-4 text-slate-300">{j.department}</td>
                  <td className="py-4 pr-4 font-mono tabular-nums">{j.applicants}</td>
                  <td className="py-4 pr-4 font-mono tabular-nums text-brand-success">{j.shortlisted}</td>
                  <td className="py-4 pr-4 text-slate-400">{j.deadline}</td>
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
      </Panel>
    </div>
  );
}

function NewJobDialog() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<Awaited<ReturnType<typeof mockParseJd>> | null>(null);

  const run = async () => {
    setBusy(true);
    const input = file ? `Uploaded: ${file.name}` : jd;
    const res = await mockParseJd(input);
    setParsed(res);
    setBusy(false);
    toast.success("JD parsed", { description: "Structured requirements extracted." });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-brand-surface border-brand-border">
        <DialogHeader>
          <DialogTitle>Create a new job</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="paste" className="mt-2">
          <TabsList className="bg-brand-bg">
            <TabsTrigger value="paste">Paste description</TabsTrigger>
            <TabsTrigger value="upload">Upload file</TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="pt-4 space-y-3">
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="bg-brand-bg border-brand-border font-mono text-xs"
            />
          </TabsContent>
          <TabsContent value="upload" className="pt-4 space-y-3">
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-border bg-brand-bg py-10 cursor-pointer hover:border-brand-accent transition">
              <Upload className="h-6 w-6 text-brand-accent" />
              <span className="text-sm text-slate-300">
                {file ? file.name : "Drop PDF, DOCX, TXT or MD — or click to browse"}
              </span>
              <span className="mono-label">Max 10 MB</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </TabsContent>
        </Tabs>

        {parsed && (
          <div className="mt-2 rounded-lg border border-brand-border bg-brand-bg p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-success mono-label">
              <FileText className="h-3 w-3" /> AI Extracted Structure
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              <Field label="Title" value={parsed.title} />
              <Field label="Seniority" value={parsed.seniority} />
              <Field label="Type" value={parsed.employmentType} />
              <Field label="Location" value={parsed.location} />
              <Field label="Salary" value={parsed.salary} />
              <Field label="Required" value={parsed.requiredSkills.join(", ")} />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Input placeholder="Role title (auto-fills from parse)" defaultValue={parsed?.title ?? ""} className="bg-brand-bg border-brand-border" />
          <Button onClick={run} disabled={busy || (!jd && !file)}>
            {busy ? "Parsing…" : parsed ? "Re-parse" : "Parse with AI"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.success("Job created (mock)");
              setOpen(false);
              setParsed(null);
              setJd("");
              setFile(null);
            }}
            disabled={!parsed}
          >
            Create job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="mono-label">{label}</div>
      <div className="text-slate-200 truncate">{value ?? "—"}</div>
    </div>
  );
}
