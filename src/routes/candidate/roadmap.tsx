import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Mic } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { roadmap } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate/roadmap")({
  head: () => ({
    meta: [
      { title: "Prep Roadmap — AIHire Pro" },
      { name: "description", content: "Personalized weekly plan unlocked after your first mock interview." },
    ],
  }),
  component: RoadmapPage,
});

const KIND_COLOR: Record<string, string> = {
  Study: "text-brand-accent",
  Practice: "text-brand-success",
  Project: "text-brand-warning",
  Reading: "text-muted-foreground",
  Prep: "text-brand-accent",
};

function RoadmapPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(typeof window !== "undefined" && localStorage.getItem("interview_completed") === "1");
  }, []);

  if (!unlocked) {
    return (
      <div>
        <PageHeader eyebrow="Locked" title="Prep Roadmap" subtitle="Your personalized roadmap unlocks after your first mock interview." />
        <Panel className="text-center py-16">
          <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-brand-warning/10 text-brand-warning mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Complete a mock interview to unlock</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Your roadmap is tailored to what the agent observes in your first interview — strengths, gaps, and pacing.
          </p>
          <Link to="/candidate/interview">
            <Button className="gap-2"><Mic className="h-4 w-4" /> Start mock interview</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Agentic Preparation Planner"
        title="Your 4-week roadmap"
        subtitle="Personalized to your ATS gaps, target role, and interview performance."
      />

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-brand-border md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-8">
          {roadmap.map((w, i) => (
            <div key={w.week} className={`relative grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`}>
              <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <div className="mono-label">{w.week}</div>
                <div className="text-lg font-semibold text-foreground mt-1">{w.focus}</div>
              </div>
              <div className={`pl-12 md:pl-0 mt-3 md:mt-0 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8"} [direction:ltr]`}>
                <Panel>
                  <ul className="space-y-2">
                    {w.items.map((it) => (
                      <li key={it.label} className="flex gap-3 text-sm">
                        <span className={`mono-label !text-[10px] mt-0.5 w-14 shrink-0 ${KIND_COLOR[it.kind] ?? ""}`}>{it.kind}</span>
                        <span className="text-foreground">{it.label}</span>
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
