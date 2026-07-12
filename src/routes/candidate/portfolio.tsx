import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Plus } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { candidateProfile } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate/portfolio")({
  head: () => ({
    meta: [
      { title: "Profile — AIHire Pro" },
      { name: "description", content: "Manage your profile, professional links, and projects." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Your profile"
        subtitle="Keep your links, skills, and preferences up to date. Recruiters see this first."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel eyebrow="Personal" title="Profile" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input defaultValue={candidateProfile.name} className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input defaultValue={candidateProfile.headline} className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input defaultValue={candidateProfile.location} className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Years of experience</Label>
              <Input defaultValue={String(candidateProfile.yearsExperience)} className="bg-brand-bg border-brand-border" />
            </div>
          </div>
          <div className="mt-6">
            <Label className="mono-label mb-2 block">Skills</Label>
            <div className="flex flex-wrap gap-1.5">
              {candidateProfile.skills.map((s) => (
                <Badge key={s} variant="outline" className="border-brand-border">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          eyebrow="Links"
          title="Professional URLs"
          action={
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          }
        >
          <div className="space-y-2">
            {candidateProfile.hyperlinks.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-bg p-3 hover:border-brand-accent transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="mono-label !text-[10px]">{l.type}</div>
                  <div className="text-sm text-white truncate">{l.label}</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Preferences" title="Career preferences" className="lg:col-span-3">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Preferred locations</Label>
              <Input defaultValue="Remote · EU · US East" className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Employment type</Label>
              <Input defaultValue="Full-time" className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Salary expectation</Label>
              <Input defaultValue="$180k+" className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Notice period</Label>
              <Input defaultValue="4 weeks" className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Work authorization</Label>
              <Input defaultValue="EU · US (H1B transfer)" className="bg-brand-bg border-brand-border" />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Input defaultValue="Actively interviewing" className="bg-brand-bg border-brand-border" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
