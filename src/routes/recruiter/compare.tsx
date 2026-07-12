import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/AppShell";
import { candidates } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MatchBar } from "@/components/AtsRadial";

export const Route = createFileRoute("/recruiter/compare")({
  head: () => ({
    meta: [
      { title: "Compare Candidates — AIHire Pro" },
      { name: "description", content: "Side-by-side AI candidate comparison across every dimension." },
    ],
  }),
  component: ComparePage,
});

const DIMS = [
  { key: "matchScore", label: "Semantic Match" },
  { key: "atsScore", label: "ATS Compatibility" },
  { key: "portfolioScore", label: "Portfolio Quality" },
  { key: "interviewScore", label: "Interview Signal" },
  { key: "communicationScore", label: "Communication" },
] as const;

function ComparePage() {
  const [ids, setIds] = useState<string[]>([candidates[0].id, candidates[1].id, candidates[3].id]);
  const selected = ids.map((id) => candidates.find((c) => c.id === id)!).filter(Boolean);

  const setSlot = (i: number, v: string) => {
    const next = [...ids];
    next[i] = v;
    setIds(next);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Explainable AI"
        title="Compare candidates"
        subtitle="Pick up to 4 candidates. AI weighs each dimension and explains the recommendation."
      />

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((i) => (
            <Select key={i} value={ids[i]} onValueChange={(v) => setSlot(i, v)}>
              <SelectTrigger className="bg-brand-bg border-brand-border">
                <SelectValue placeholder={`Slot ${i + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} · {c.matchScore}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {selected.map((c) => (
            <div key={c.id} className="rounded-xl border border-brand-border bg-brand-bg p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-border">
                <div className="h-10 w-10 rounded-full bg-brand-accent/15 grid place-items-center text-brand-accent text-xs font-semibold">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.headline}</div>
                </div>
              </div>
              <div className="space-y-3">
                {DIMS.map((d) => (
                  <MatchBar key={d.key} label={d.label} value={c[d.key]} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border">
                <div className="mono-label mb-1">AI Verdict</div>
                <div className="text-xs text-slate-300">
                  {c.matchScore >= 95
                    ? "Strong hire — top-tier candidate for this role."
                    : c.matchScore >= 85
                      ? "Solid hire — proceed to on-site loop."
                      : "Consider — strong in specific dimensions, gap in others."}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border-2 border-brand-success bg-brand-success/5 p-5">
          <div className="mono-label text-brand-success mb-2">AI Recommendation</div>
          <div className="text-sm text-foreground">
            Move forward with <span className="font-semibold">{selected[0]?.name}</span> and{" "}
            <span className="font-semibold">{selected[1]?.name}</span> to the on-site round.{" "}
            <span className="font-semibold">{selected[2]?.name}</span> is a strong hold — reconsider if either
            declines.
          </div>
        </div>
      </Panel>
    </div>
  );
}
