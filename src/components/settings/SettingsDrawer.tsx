import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings, useSettings, hasSupabaseConfig } from "@/lib/settings-store";



export function SettingsDrawer({ floating = true }: { floating?: boolean } = {}) {
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(settings.supabaseUrl);
  const [key, setKey] = useState(settings.supabaseAnonKey);
  const [groq, setGroq] = useState(settings.groqApiKey);

  useEffect(() => {
    if (open) {
      const s = getSettings();
      setUrl(s.supabaseUrl);
      setKey(s.supabaseAnonKey);
      setGroq(s.groqApiKey);
    }
  }, [open]);

  const save = () => {
    saveSettings({
      supabaseUrl: url.trim(),
      supabaseAnonKey: key.trim(),
      groqApiKey: groq.trim(),
    });
    toast.success("Settings saved locally", {
      description: "Keys are stored in your browser only.",
    });
  };

  const clear = () => {
    saveSettings({ supabaseUrl: "", supabaseAnonKey: "", groqApiKey: "" });
    setUrl("");
    setKey("");
    setGroq("");
    toast.message("Cleared all keys");
  };

  const test = async () => {
    if (!url || !key) {
      toast.error("Enter both Supabase URL and anon key");
      return;
    }
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.ok || res.status === 404) {
        toast.success("Reachable", { description: `HTTP ${res.status}` });
      } else {
        toast.error("Connection failed", { description: `HTTP ${res.status}` });
      }
    } catch (e) {
      toast.error("Network error", { description: String(e) });
    }
  };

  const testAi = async () => {
    if (!groq) {
      toast.error("Enter a Groq API key");
      return;
    }
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${groq.trim()}` },
      });
      if (res.ok) toast.success("AI key OK");
      else toast.error(`AI check failed: HTTP ${res.status}`);
    } catch (e) {
      toast.error("Network error", { description: String(e) });
    }
  };

  const connected = hasSupabaseConfig(settings);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {floating ? (
          <button
            type="button"
            aria-label="Settings"
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-xs hover:border-brand-accent transition-colors shadow-lg"
          >
            <Settings2 className="h-4 w-4" />
            <span className="mono-label">Settings</span>
            {connected && <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />}
          </button>
        ) : (
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-xs hover:border-brand-accent transition-colors"
          >
            <Settings2 className="h-4 w-4" />
            <span className="mono-label">Settings</span>
            {connected && <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />}
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md bg-brand-surface border-brand-border overflow-y-auto chat-scroll">
        <SheetHeader>
          <SheetTitle>Workspace Settings</SheetTitle>
          <SheetDescription>
            Connect Supabase and your AI provider. Keys stay in your browser (localStorage).
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1">
          <section className="space-y-3">
            <div className="mono-label">Supabase</div>
            <div className="space-y-2">
              <Label htmlFor="sb-url">Project URL</Label>
              <Input
                id="sb-url"
                placeholder="https://xxxxx.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sb-key">Anon / Publishable Key</Label>
              <Input
                id="sb-key"
                placeholder="eyJhbGciOi..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                type="password"
                className="font-mono text-xs"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={save}>Save</Button>
              <Button size="sm" variant="outline" onClick={test}>Test connection</Button>
              <Button size="sm" variant="ghost" onClick={clear} className="ml-auto">
                Clear
              </Button>
            </div>
          </section>

          <Separator className="bg-brand-border" />

          <section className="space-y-3">
            <div className="mono-label">Agentic AI</div>
            <div className="space-y-2">
              <Label htmlFor="ai-key">Groq API Key</Label>
              <Input
                id="ai-key"
                placeholder="gsk_..."
                value={groq}
                onChange={(e) => setGroq(e.target.value)}
                type="password"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Get a free key at <code className="font-mono">console.groq.com</code>. Without it, AI runs in mock mode.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={save}>Save</Button>
              <Button size="sm" variant="outline" onClick={testAi}>Test AI</Button>
            </div>
            <div className="rounded-lg border border-brand-border bg-brand-bg p-3 text-[11px] text-muted-foreground flex items-center justify-between mt-2">
              <span>Status</span>
              <span className={settings.groqApiKey ? "font-mono text-brand-success" : "font-mono text-brand-warning"}>
                {settings.groqApiKey ? "LIVE" : "MOCKED"}
              </span>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

