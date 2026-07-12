import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Wand2, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { AtsRadial } from "@/components/AtsRadial";
import { Button } from "@/components/ui/button";
import { candidateProfile } from "@/lib/mock-data";
import { mockParseResume } from "@/lib/mock-ai";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/candidate/resume")({
  head: () => ({
    meta: [
      { title: "Resume Insights — AIHire Pro" },
      { name: "description", content: "Upload your resume for AI-powered ATS scoring and optimization." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<Awaited<ReturnType<typeof mockParseResume>> | null>(null);

  const onFile = async (f: File) => {
    setBusy(true);
    const res = await mockParseResume(f.name);
    setParsed(res);
    setBusy(false);
    toast.success("Resume parsed", { description: `${res.skills.length} skills · ${res.hyperlinks.length} links detected` });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Resume"
        title="Resume insights & optimizer"
        subtitle="Parse your resume, score it against ATS, and rewrite weak sections with AI."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel eyebrow="Upload" title="Drop your resume" className="lg:col-span-2">
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-brand-border bg-brand-bg py-12 cursor-pointer hover:border-brand-accent transition">
            <Upload className="h-7 w-7 text-brand-accent" />
            <div className="text-sm text-slate-200">
              {busy ? "Parsing…" : parsed ? parsed.fileName : "Drop PDF, DOCX, TXT or MD"}
            </div>
            <div className="mono-label">or click to browse</div>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
          </label>

          {parsed && (
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-bg p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-success" />
                <span className="mono-label text-brand-success">AI Extracted</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <Field label="Name" value={parsed.fullName} />
                <Field label="Email" value={parsed.email} />
                <Field label="Phone" value={parsed.phone} />
                <Field label="Location" value={parsed.location} />
              </div>
              <div>
                <div className="mono-label mb-2">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {parsed.skills.map((s) => (
                    <Badge key={s} variant="outline" className="border-brand-border">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono-label mb-2">Experience</div>
                <div className="space-y-2">
                  {parsed.experience.map((e) => (
                    <div key={e.company} className="text-xs">
                      <div className="text-white">
                        {e.role} · <span className="text-slate-300">{e.company}</span>
                      </div>
                      <div className="text-muted-foreground">{e.period}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono-label mb-2">Detected Links</div>
                <div className="flex flex-wrap gap-2">
                  {parsed.hyperlinks.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-xs text-brand-accent underline">
                      {l.type}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-brand-border">
                <Button className="gap-2" onClick={() => toast.success("AI rewrite complete (mock)")}>
                  <Wand2 className="h-4 w-4" /> Optimize with AI
                </Button>
              </div>
            </div>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel eyebrow="Score" title="ATS compatibility" className="text-center">
            <div className="flex flex-col items-center">
              <AtsRadial score={candidateProfile.atsScore} />
              <p className="text-sm text-muted-foreground mt-6">
                {candidateProfile.atsScore}% keyword match for senior frontend roles.
              </p>
            </div>
          </Panel>

          <Panel eyebrow="Portfolio" title={`Quality score · ${candidateProfile.portfolioScore}`}>
            <div className="space-y-2 text-sm">
              {candidateProfile.hyperlinks.map((l) => (
                <div key={l.url} className="flex items-center justify-between">
                  <span className="text-slate-300">{l.type}</span>
                  <span className="mono-label text-brand-success">verified</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Insights" title="Improve">
            <ul className="text-sm space-y-2">
              <li className="flex gap-2 text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-brand-success shrink-0" /> Strong keyword coverage
              </li>
              <li className="flex gap-2 text-slate-300">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-brand-warning shrink-0" /> Add measurable metrics
              </li>
              <li className="flex gap-2 text-slate-300">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-brand-warning shrink-0" /> Missing: System Design, Rust
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="mono-label">{label}</div>
      <div className="text-slate-200 text-sm">{value ?? "—"}</div>
    </div>
  );
}
