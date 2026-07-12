import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/AppShell";
import { roadmap } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate/roadmap")({
  head: () => ({
    meta: [
      { title: "Prep Roadmap — AIHire Pro" },
      { name: "description", content: "Personalized weekly plan to close skill gaps and interview-ready." },
    ],
  }),
  component: RoadmapPage,
});

const KIND_COLOR: Record<string, string> = {
  Study: "text-brand-accent",
  Practice: "text-brand-success",
  Project: "text-brand-warning",
  Reading: "text-slate-300",
  Prep: "text-brand-accent",
};

function RoadmapPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI Preparation Planner"
        title="Your 4-week roadmap"
        subtitle="Personalized to your ATS gaps, target role (Senior Frontend Engineer), and target company culture."
      />

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-brand-border md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-8">
          {roadmap.map((w, i) => (
            <div key={w.week} className={`relative grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`}>
              <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <div className="mono-label">{w.week}</div>
                <div className="text-lg font-semibold text-white mt-1">{w.focus}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {i === 0
                    ? "Set the foundation for system-design fluency."
                    : i === 1
                      ? "Deep dive into React internals + measurable performance wins."
                      : i === 2
                        ? "Sharpen behavioral stories and communication."
                        : "Company-specific research and dry runs."}
                </p>
              </div>
              <div className={`pl-12 md:pl-0 mt-3 md:mt-0 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8"} [direction:ltr]`}>
                <Panel>
                  <ul className="space-y-2">
                    {w.items.map((it) => (
                      <li key={it.label} className="flex gap-3 text-sm">
                        <span className={`mono-label !text-[10px] mt-0.5 w-14 shrink-0 ${KIND_COLOR[it.kind] ?? ""}`}>{it.kind}</span>
                        <span className="text-slate-200">{it.label}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
              <div className="absolute left-4 top-2 md:left-1/2 md:-translate-x-1/2 h-3 w-3 rounded-full bg-brand-accent ring-4 ring-brand-bg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
