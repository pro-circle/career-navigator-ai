import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Play, Square } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MatchBar } from "@/components/AtsRadial";
import { interviewScripts } from "@/lib/mock-data";
import { mockEvaluateInterview } from "@/lib/mock-ai";

export const Route = createFileRoute("/candidate/interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview — AIHire Pro" },
      { name: "description", content: "Practice with an adaptive AI interviewer. Voice or text." },
    ],
  }),
  component: InterviewPage,
});

type Report = Awaited<ReturnType<typeof mockEvaluateInterview>>;

function InterviewPage() {
  const [phase, setPhase] = useState<"setup" | "session" | "report">("setup");
  const [type, setType] = useState<keyof typeof interviewScripts>("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [recording, setRecording] = useState(false);

  const script = interviewScripts[type];
  const question = script[idx];

  const start = () => {
    setIdx(0);
    setAnswer("");
    setPhase("session");
    toast.message("Session started", { description: "Answer naturally. AI will ask follow-ups." });
  };

  const next = () => {
    if (idx < script.length - 1) {
      setIdx((i) => i + 1);
      setAnswer("");
    } else {
      finish();
    }
  };

  const finish = async () => {
    const r = await mockEvaluateInterview();
    setReport(r);
    setPhase("report");
  };

  const toggleMic = () => {
    setRecording((r) => !r);
    if (!recording) toast.message("Recording (simulated)", { description: "Web Speech transcript not wired in mock" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="AI Mock Interview"
        subtitle="Adaptive interviewer that asks follow-up questions based on your response."
      />

      {phase === "setup" && (
        <Panel eyebrow="Configure" title="Session setup">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as keyof typeof interviewScripts)}>
                <SelectTrigger className="bg-brand-bg border-brand-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(interviewScripts) as (keyof typeof interviewScripts)[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-brand-bg border-brand-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-brand-bg border-brand-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senior Frontend Engineer">Senior Frontend Engineer</SelectItem>
                  <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                  <SelectItem value="Product Designer">Product Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-6 gap-2" onClick={start}>
            <Play className="h-4 w-4" /> Launch AI Interviewer
          </Button>
        </Panel>
      )}

      {phase === "session" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <Panel eyebrow={`Question ${idx + 1} of ${script.length}`} title={question}>
            <div className="rounded-xl border border-brand-border bg-brand-bg p-4 text-sm text-slate-300 leading-relaxed">
              <span className="mono-label text-brand-accent">AI Interviewer</span>
              <p className="mt-2">
                Take your time. I'll follow up based on your response. Speak with the mic, or type your answer below.
              </p>
            </div>
            <div className="mt-4">
              <Label className="mono-label mb-2 block">Your answer</Label>
              <Textarea
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Start typing…"
                className="bg-brand-bg border-brand-border"
              />
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" onClick={toggleMic} className="gap-2">
                  {recording ? <MicOff className="h-4 w-4 text-brand-danger" /> : <Mic className="h-4 w-4" />}
                  {recording ? "Stop recording" : "Voice"}
                </Button>
                <Button className="ml-auto gap-2" onClick={next}>
                  {idx < script.length - 1 ? "Next question" : "Finish & evaluate"}
                </Button>
                <Button variant="ghost" onClick={finish} className="gap-2">
                  <Square className="h-4 w-4" /> End
                </Button>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Session" title="Progress">
            <div className="space-y-3">
              <MatchBar value={((idx + 1) / script.length) * 100} label={`${idx + 1}/${script.length}`} />
              <div className="mono-label pt-2">Type</div>
              <div className="text-sm text-white">
                {type} · {difficulty}
              </div>
              <div className="mono-label pt-2">Role</div>
              <div className="text-sm text-white">{role}</div>
            </div>
          </Panel>
        </div>
      )}

      {phase === "report" && report && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Panel eyebrow="Evaluation" title={`Overall · ${report.overall}`} className="lg:col-span-2">
            <p className="text-sm text-slate-300 mb-6">{report.verdict}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {report.dims.map((d) => (
                <MatchBar key={d.name} label={d.name} value={d.score} />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-brand-border">
              <div>
                <div className="mono-label text-brand-success mb-2">Strengths</div>
                <ul className="text-sm space-y-1 text-slate-300">
                  {report.strengths.map((s) => (
                    <li key={s}>+ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mono-label text-brand-warning mb-2">Improve</div>
                <ul className="text-sm space-y-1 text-slate-300">
                  {report.improvements.map((s) => (
                    <li key={s}>— {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="Next" title="What to do">
            <ul className="text-sm space-y-3 text-slate-300">
              <li>+ Repeat the same interview type at Advanced level.</li>
              <li>+ Add measurable metrics to your resume this week.</li>
              <li>+ Schedule a live peer mock in 3 days.</li>
            </ul>
            <Button className="mt-6 w-full" onClick={() => setPhase("setup")}>
              Start new session
            </Button>
          </Panel>
        </div>
      )}
    </div>
  );
}
