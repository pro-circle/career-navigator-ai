import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStreamChat } from "@/lib/mock-ai";

export const Route = createFileRoute("/candidate/assistant")({
  head: () => ({
    meta: [
      { title: "Personal Trainee — AIHire Pro" },
      { name: "description", content: "Your agentic career trainee. Streaming answers on resumes, applications, and interviews." },
    ],
  }),
  component: TraineePage,
});

const QUICK = [
  "Why is my ATS score 84?",
  "Should I apply to Netflix now or wait?",
  "How do I answer 'tell me about yourself'?",
  "Which certifications will boost my resume?",
];

function TraineePage() {
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi Alex — I'm your Personal Trainee. Ask me anything about your job search." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: "" }]);
    setInput("");
    setBusy(true);
    await mockStreamChat(text, (chunk) => {
      setMsgs((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "ai") next[next.length - 1] = { role: "ai", text: last.text + chunk };
        return next;
      });
    });
    setBusy(false);
  };

  return (
    <div>
      <PageHeader eyebrow="Personal Trainee" title="Career copilot" subtitle="Streaming, personalized guidance tuned to your profile." />

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        <Panel className="flex flex-col h-[560px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-success/15 border border-brand-success/30 px-4 py-2.5 text-sm"
                    : "mr-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-brand-bg border border-brand-border px-4 py-2.5 text-sm"
                }
              >
                {m.text}
                {busy && i === msgs.length - 1 && m.role === "ai" && (
                  <span className="ml-1 inline-block h-3 w-1 bg-brand-accent align-middle animate-pulse" />
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 pt-4 border-t border-brand-border mt-4"
          >
            <Input
              placeholder="Ask your Personal Trainee…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-brand-bg border-brand-border"
            />
            <Button type="submit" disabled={busy} className="gap-2">
              <Send className="h-4 w-4" /> Send
            </Button>
          </form>
        </Panel>
        <Panel eyebrow="Try asking" title="Quick starts">
          <div className="space-y-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="w-full text-left text-xs rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 hover:border-brand-success transition flex items-start gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-success mt-0.5 shrink-0" />
                <span className="text-foreground">{q}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
