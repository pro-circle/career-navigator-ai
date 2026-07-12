import { useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChat } from "@/lib/mock-ai";

type Msg = { role: "user" | "ai"; text: string };

export function AiChatDock({ persona = "Hiring Intelligence", suggestions }: { persona?: string; suggestions?: string[] }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `Hi — I'm your ${persona} assistant. Ask me anything.` },
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-brand-accent/20 hover:brightness-110 transition"
      >
        <Sparkles className="h-4 w-4" />
        Ask AI
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-brand-surface border-brand-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-accent" /> AI {persona}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-accent/15 border border-brand-accent/30 px-3 py-2 text-sm"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-bg border border-brand-border px-3 py-2 text-sm text-slate-200"
                }
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="mr-auto text-xs text-muted-foreground font-mono animate-pulse">AI is thinking…</div>
            )}
          </div>
          {suggestions && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] rounded-full border border-brand-border bg-brand-bg px-3 py-1 hover:border-brand-accent transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 pt-3 border-t border-brand-border"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="bg-brand-bg border-brand-border"
            />
            <Button type="submit" size="icon" disabled={busy}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
