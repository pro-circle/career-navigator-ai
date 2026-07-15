import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MatchBar } from "@/components/AtsRadial";
import { mockAnalyzeExternalJob } from "@/lib/mock-ai";
import { RequireResume } from "@/components/RequireResume";

export const Route = createFileRoute("/candidate/external")({
  head: () => ({
    meta: [
      { title: "External Job Analyzer — AIHire Pro" },
      { name: "description", content: "Paste any job URL. AI extracts requirements and generates prep." },
    ],
  }),
  component: ExternalPage,
});

function ExternalPage() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Awaited<ReturnType<typeof mockAnalyzeExternalJob>> | null>(null);

  const run = async () => {
    if (!url) {
      toast.error("Paste a job URL first");
      return;
    }
    setBusy(true);
    try {
      const r = await mockAnalyzeExternalJob(url);
      setRes(r);
      toast.success("Analysis complete");
    } catch (e) {
      toast.error("Agentic AI unavailable", { description: String((e as Error).message ?? e) });
    } finally {
      setBusy(false);
    }
  };


  return (
    <div>
      <PageHeader
        eyebrow="External Job Intelligence"
        title="Analyze any job posting"
        subtitle="Paste a URL from LinkedIn, Indeed, Greenhouse, Lever, or any company career page."
      />
      <RequireResume feature="External Job Analyzer" description="We compare the posting against the skills and experience in your resume to compute match, gaps, and prep.">

      <Panel>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="pl-9 bg-brand-bg border-brand-border font-mono text-xs"
            />
          </div>
          <Button onClick={run} disabled={busy} className="gap-2">
            <Sparkles className="h-4 w-4" /> {busy ? "Analyzing…" : "Analyze"}
          </Button>
        </div>
      </Panel>

      {res && (
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Panel eyebrow={res.company} title={res.title} className="lg:col-span-2">
            <div className="text-sm text-muted-foreground mb-4 truncate">Source: {res.source}</div>
            <div className="space-y-3 mb-6">
              <MatchBar label="Overall match" value={res.matchScore} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="mono-label mb-2 text-brand-success">Matched skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {res.matchedSkills.map((s) => (
                    <Badge key={s} className="bg-brand-success/15 text-brand-success border border-brand-success/30">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono-label mb-2 text-brand-warning">Skill gaps</div>
                <div className="flex flex-wrap gap-1.5">
                  {res.missingSkills.map((s) => (
                    <Badge key={s} variant="outline" className="border-brand-warning/40 text-brand-warning">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="AI" title="Interview questions">
            <ul className="space-y-2 text-sm">
              {res.interviewQuestions.map((q, i) => (
                <li key={i} className="flex gap-2 text-slate-300">
                  <span className="text-brand-accent font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  {q}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel eyebrow="Prep plan" title="Focus areas" className="lg:col-span-2">
            <ul className="space-y-2 text-sm">
              {res.prep.map((p, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="mono-label !text-[10px] mt-1">W{i + 1}</span>
                  {p}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel eyebrow="Resume tips" title="Improve for this role">
            <ul className="space-y-2 text-sm">
              {res.resumeTips.map((t, i) => (
                <li key={i} className="text-slate-300">
                  — {t}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
      </RequireResume>
    </div>
  );
}
