import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChat } from "@/lib/mock-ai";

export const Route = createFileRoute("/recruiter/assistant")({
  head: () => ({
    meta: [
      { title: "AI Recruiter Assistant — AIHire Pro" },
      { name: "description", content: "Chat with the AI recruiter assistant to summarize, compare, and shortlist." },
    ],
  }),
  component: AssistantPage,
});

const QUICK = [
  "Summarize the top 5 candidates for j-4029",
  "Compare Elena vs Marcus on system design",
  "Draft 5 behavioral interview questions",
  "Which candidates should I move to on-site?",
];

function AssistantPage() {
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi — I'm your AI recruiter assistant. Ask me to summarize, compare, or shortlist." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    const reply = await mockChat(text);
    setMsgs((m) => [...m, { role: "ai", text: reply }]);
    setBusy(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Assistant"
        title="Recruiter copilot"
        subtitle="Ask questions across every candidate, job, and portfolio in your workspace."
      />

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        <Panel className="flex flex-col h-[560px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-accent/15 border border-brand-accent/30 px-4 py-2.5 text-sm"
                    : "mr-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-brand-bg border border-brand-border px-4 py-2.5 text-sm"
                }
              >
                {m.text}
              </div>
            ))}
            {busy && <div className="text-xs mono-label animate-pulse">AI is thinking…</div>}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 pt-4 border-t border-brand-border mt-4"
          >
            <Input
              placeholder="Ask anything about your pipeline…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-brand-bg border-brand-border"
            />
            <Button type="submit" disabled={busy} className="gap-2">
              <Send className="h-4 w-4" /> Send
            </Button>
          </form>
        </Panel>

        <Panel eyebrow="Quick actions" title="Try">
          <div className="space-y-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="w-full text-left text-xs rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 hover:border-brand-accent transition flex items-start gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-accent mt-0.5 shrink-0" />
                <span className="text-slate-300">{q}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
