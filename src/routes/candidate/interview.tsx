import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Play, Square, Code2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MatchBar } from "@/components/AtsRadial";
import { interviewScripts } from "@/lib/mock-data";
import { mockCodingQuestions, mockEvaluateCode, mockEvaluateInterview } from "@/lib/mock-ai";

export const Route = createFileRoute("/candidate/interview")({
  head: () => ({
    meta: [
      { title: "Agentic Mock Interview — AIHire Pro" },
      { name: "description", content: "Practice with an adaptive interviewer + live coding IDE tuned by company and difficulty." },
    ],
  }),
  component: InterviewPage,
});

type Report = Awaited<ReturnType<typeof mockEvaluateInterview>>;
type Coding = Awaited<ReturnType<typeof mockCodingQuestions>>;
type CodeEval = Awaited<ReturnType<typeof mockEvaluateCode>>;

type Difficulty = "Easy" | "Medium" | "Hard";

function InterviewPage() {
  const [phase, setPhase] = useState<"setup" | "session" | "coding" | "report">("setup");
  const [type, setType] = useState<keyof typeof interviewScripts>("Technical");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [company, setCompany] = useState("Netflix");
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [recording, setRecording] = useState(false);
  const [coding, setCoding] = useState<Coding | null>(null);
  const [codingIdx, setCodingIdx] = useState(0);
  const [code, setCode] = useState("");
  const [codeEval, setCodeEval] = useState<CodeEval | null>(null);
  const [codingBusy, setCodingBusy] = useState(false);

  const script = interviewScripts[type];
  const question = script[idx];

  const start = () => {
    setIdx(0);
    setAnswer("");
    setPhase("session");
    toast.message("Session started", { description: "Answer naturally. Agent will ask follow-ups." });
  };

  const next = () => {
    if (idx < script.length - 1) {
      setIdx((i) => i + 1);
      setAnswer("");
    } else {
      startCoding();
    }
  };

  const startCoding = async () => {
    try {
      const qs = await mockCodingQuestions(difficulty, company);
      if (!qs || qs.length === 0) throw new Error("No questions returned");
      setCoding(qs);
      setCodingIdx(0);
      setCode(qs[0].starter);
      setCodeEval(null);
      setPhase("coding");
      toast.message("Coding round", { description: `${difficulty} · tuned to ${company} interview history.` });
    } catch (e) {
      toast.error("Agentic AI unavailable", { description: String((e as Error).message ?? e) });
    }
  };

  const runTests = async () => {
    setCodingBusy(true);
    try {
      const res = await mockEvaluateCode(code);
      setCodeEval(res);
      toast.success(`${res.passed}/${res.total} tests passed`);
    } catch (e) {
      toast.error("Evaluation failed", { description: String((e as Error).message ?? e) });
    } finally {
      setCodingBusy(false);
    }
  };

  const nextCoding = () => {
    if (!coding) return;
    if (codingIdx < coding.length - 1) {
      setCodingIdx((i) => i + 1);
      setCode(coding[codingIdx + 1].starter);
      setCodeEval(null);
    } else {
      finish();
    }
  };

  const finish = async () => {
    try {
      const r = await mockEvaluateInterview();
      setReport(r);
      setPhase("report");
      try {
        localStorage.setItem("interview_completed", "1");
      } catch {
        /* ignore */
      }
    } catch (e) {
      toast.error("Could not score interview", { description: String((e as Error).message ?? e) });
    }
  };


  const toggleMic = () => {
    setRecording((r) => !r);
    if (!recording) toast.message("Recording (simulated)", { description: "Web Speech transcript not wired in mock" });
  };

  useEffect(() => {
    // no-op placeholder for future streaming interviewer hookups
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Agentic Mock Interview"
        subtitle="Adaptive interviewer + coding IDE. Difficulty and questions tuned to the target company's interview history."
      />

      {phase === "setup" && (
        <Panel eyebrow="Configure" title="Session setup">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as keyof typeof interviewScripts)}>
                <SelectTrigger className="bg-brand-bg border-brand-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(interviewScripts) as (keyof typeof interviewScripts)[]).map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Coding difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="bg-brand-bg border-brand-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Target role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} className="bg-brand-bg border-brand-border" />
            </div>
          </div>
          <Button className="mt-6 gap-2" onClick={start}>
            <Play className="h-4 w-4" /> Launch Agentic Interviewer
          </Button>
        </Panel>
      )}

      {phase === "session" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <Panel eyebrow={`Question ${idx + 1} of ${script.length}`} title={question}>
            <div className="rounded-xl border border-brand-border bg-brand-bg p-4 text-sm text-muted-foreground leading-relaxed">
              <span className="mono-label text-brand-accent">AI Interviewer</span>
              <p className="mt-2">Take your time. I'll follow up based on your response.</p>
            </div>
            <div className="mt-4">
              <Label className="mono-label mb-2 block">Your answer</Label>
              <Textarea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Start typing…" className="bg-brand-bg border-brand-border" />
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" onClick={toggleMic} className="gap-2">
                  {recording ? <MicOff className="h-4 w-4 text-brand-danger" /> : <Mic className="h-4 w-4" />}
                  {recording ? "Stop recording" : "Voice"}
                </Button>
                <Button className="ml-auto gap-2" onClick={next}>
                  {idx < script.length - 1 ? "Next question" : "Continue to coding →"}
                </Button>
                <Button variant="ghost" onClick={finish} className="gap-2">
                  <Square className="h-4 w-4" /> End
                </Button>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Session" title="Progress">
            <MatchBar value={((idx + 1) / script.length) * 100} label={`${idx + 1}/${script.length}`} />
            <div className="mono-label pt-4">Company · Difficulty</div>
            <div className="text-sm text-foreground">{company} · {difficulty}</div>
            <div className="mono-label pt-2">Role</div>
            <div className="text-sm text-foreground">{role}</div>
          </Panel>
        </div>
      )}

      {phase === "coding" && coding && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <Panel
            eyebrow={`Coding · ${difficulty} · Q${codingIdx + 1}/${coding.length}`}
            title={coding[codingIdx].title}
            action={<span className="mono-label text-brand-accent">{company} history</span>}
          >
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{coding[codingIdx].prompt}</p>
            <div className="rounded-xl border border-brand-border bg-[#0a0f14] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-brand-border bg-brand-surface">
                <div className="flex items-center gap-2 text-xs">
                  <Code2 className="h-3.5 w-3.5 text-brand-accent" />
                  <span className="mono-label !text-[10px]">{coding[codingIdx].language}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-danger/60" />
                  <span className="h-2 w-2 rounded-full bg-brand-warning/60" />
                  <span className="h-2 w-2 rounded-full bg-brand-success/60" />
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-72 bg-[#0a0f14] text-emerald-100 font-mono text-[13px] leading-relaxed p-4 outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button onClick={runTests} disabled={codingBusy} className="gap-2">
                {codingBusy ? "Running…" : "Run tests"}
              </Button>
              <Button variant="outline" onClick={nextCoding} className="ml-auto">
                {codingIdx < coding.length - 1 ? "Next problem" : "Finish & evaluate"}
              </Button>
            </div>

            {codeEval && (
              <div className="mt-4 rounded-xl border border-brand-border bg-brand-bg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className={`h-4 w-4 ${codeEval.passed === codeEval.total ? "text-brand-success" : "text-brand-warning"}`} />
                  <span className="text-sm font-semibold text-foreground">
                    {codeEval.passed}/{codeEval.total} tests passed · complexity {codeEval.complexity}
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                  {codeEval.feedback.map((f: string) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            )}
          </Panel>

          <Panel eyebrow="Session" title="Coding round">
            <MatchBar value={((codingIdx + 1) / coding.length) * 100} label={`${codingIdx + 1}/${coding.length}`} />
            <div className="mono-label pt-4">Difficulty</div>
            <div className="text-sm text-foreground">{difficulty}</div>
            <div className="mono-label pt-2">Company profile</div>
            <div className="text-sm text-foreground">{company}</div>
            <p className="text-xs text-muted-foreground mt-3">
              Questions selected from a bank tuned to typical {company} interview loops.
            </p>
          </Panel>
        </div>
      )}

      {phase === "report" && report && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Panel eyebrow="Evaluation" title={`Overall · ${report.overall}`} className="lg:col-span-2">
            <p className="text-sm text-muted-foreground mb-6">{report.verdict}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {report.dims.map((d) => <MatchBar key={d.name} label={d.name} value={d.score} />)}
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-brand-border">
              <div>
                <div className="mono-label text-brand-success mb-2">Strengths</div>
                <ul className="text-sm space-y-1 text-muted-foreground">{report.strengths.map((s) => <li key={s}>+ {s}</li>)}</ul>
              </div>
              <div>
                <div className="mono-label text-brand-warning mb-2">Improve</div>
                <ul className="text-sm space-y-1 text-muted-foreground">{report.improvements.map((s) => <li key={s}>— {s}</li>)}</ul>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="Unlocked" title="Prep Roadmap available">
            <p className="text-sm text-muted-foreground mb-4">
              Your personalized 4-week roadmap is now unlocked, tailored to what the agent observed in this session.
            </p>
            <a href="/candidate/roadmap" className="inline-block">
              <Button className="w-full">Open my roadmap</Button>
            </a>
            <Button variant="outline" className="mt-3 w-full" onClick={() => setPhase("setup")}>
              Start new session
            </Button>
          </Panel>
        </div>
      )}
    </div>
  );
}
