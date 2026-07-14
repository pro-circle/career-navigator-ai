import { useEffect, useState } from "react";
import { Bell, Settings2, User } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSettings,
  saveSettings,
  useSettings,
  hasProfile,
  type UserRole,
} from "@/lib/settings-store";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function SettingsDrawer({ floating = true }: { floating?: boolean } = {}) {
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (open) setForm(getSettings());
  }, [open]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    saveSettings({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      role: form.role,
      timezone: form.timezone,
      emailNotifications: form.emailNotifications,
      productUpdates: form.productUpdates,
      compactMode: form.compactMode,
    });
    toast.success("Profile saved");
  };

  const reset = () => {
    saveSettings({
      fullName: "",
      email: "",
      jobTitle: "",
      emailNotifications: true,
      productUpdates: true,
      compactMode: false,
    });
    toast.message("Profile reset");
  };

  const complete = hasProfile(settings);

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
            {complete && <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />}
          </button>
        ) : (
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-xs hover:border-brand-accent transition-colors"
          >
            <Settings2 className="h-4 w-4" />
            <span className="mono-label">Settings</span>
            {complete && <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />}
          </button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-brand-surface border-brand-border overflow-y-auto chat-scroll"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-brand-accent" /> Account Settings
          </SheetTitle>
          <SheetDescription>
            Manage your profile, workspace role, and notification preferences.
          </SheetDescription>
        </SheetHeader>

        {/* Identity card */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg p-4">
          <div className="h-12 w-12 rounded-full bg-brand-accent/15 border border-brand-accent/40 text-brand-accent flex items-center justify-center font-semibold">
            {initials(form.fullName || "User")}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">
              {form.fullName || "Set your name"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {form.email || "Add an email"}
            </div>
            <div className="mono-label mt-1 !text-[10px]">
              {form.role === "recruiter" ? "RECRUITER" : "CANDIDATE"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6 px-1">
          {/* Profile */}
          <section className="space-y-3">
            <div className="mono-label flex items-center gap-2">
              <User className="h-3 w-3" /> Profile
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Full name</Label>
                <Input
                  id="p-name"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Alex Morgan"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-email">Email</Label>
                <Input
                  id="p-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="alex@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-title">Job title</Label>
                <Input
                  id="p-title"
                  value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)}
                  placeholder={
                    form.role === "recruiter"
                      ? "Senior Talent Partner"
                      : "Senior Frontend Engineer"
                  }
                />
              </div>
            </div>
          </section>

          <Separator className="bg-brand-border" />

          {/* Workspace */}
          <section className="space-y-3">
            <div className="mono-label">Workspace</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => set("role", v as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-tz">Timezone</Label>
                <Input
                  id="p-tz"
                  value={form.timezone}
                  onChange={(e) => set("timezone", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </section>

          <Separator className="bg-brand-border" />

          {/* Notifications */}
          <section className="space-y-3">
            <div className="mono-label flex items-center gap-2">
              <Bell className="h-3 w-3" /> Notifications
            </div>
            <ToggleRow
              label="Email notifications"
              hint="Interview invites, application updates, and shortlists."
              checked={form.emailNotifications}
              onChange={(v) => set("emailNotifications", v)}
            />
            <ToggleRow
              label="Product updates"
              hint="Occasional emails about new features."
              checked={form.productUpdates}
              onChange={(v) => set("productUpdates", v)}
            />
            <ToggleRow
              label="Compact mode"
              hint="Tighter spacing across tables and cards."
              checked={form.compactMode}
              onChange={(v) => set("compactMode", v)}
            />
          </section>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={save}>
              Save changes
            </Button>
            <Button size="sm" variant="ghost" onClick={reset} className="ml-auto">
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-brand-border bg-brand-bg p-3">
      <div className="min-w-0">
        <div className="text-sm">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
