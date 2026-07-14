import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Wand2, FileText, CheckCircle2, AlertTriangle, Sparkles, Languages, Mail } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { AtsRadial } from "@/components/AtsRadial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { candidateProfile } from "@/lib/mock-data";
import { mockBuildResume, mockCoverLetter, mockParseResume, mockTranslateResume } from "@/lib/mock-ai";

export const Route = createFileRoute("/candidate/resume")({
  head: () => ({
    meta: [
      { title: "Resume Studio — AIHire Pro" },
      { name: "description", content: "Parse, build, translate, and cover-letter your resume with agentic AI." },
    ],
  }),
  component: ResumePage,
});

type Parsed = Awaited<ReturnType<typeof mockParseResume>>;
type Built = Awaited<ReturnType<typeof mockBuildResume>>;
type Translated = Awaited<ReturnType<typeof mockTranslateResume>>;

function ResumePage() {
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<Parsed | null>(null);

  const [role, setRole] = useState("Senior Frontend Engineer");
  const [built, setBuilt] = useState<Built | null>(null);

  const [coverCompany, setCoverCompany] = useState("Netflix");
  const [coverRole, setCoverRole] = useState("Senior Frontend Engineer");
  const [cover, setCover] = useState<string>("");

  const [lang, setLang] = useState("Spanish");
  const [translated, setTranslated] = useState<Translated | null>(null);

  const onFile = async (f: File) => {
    setBusy(true);
    try {
      const res = await mockParseResume(f.name);
      setParsed(res);
      toast.success("Resume parsed", { description: `${res.skills.length} skills · ${res.hyperlinks.length} links detected` });
    } catch (e) {
      toast.error("Parse failed", { description: String((e as Error).message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  const build = async () => {
    setBusy(true);
    try {
      const r = await mockBuildResume(role, candidateProfile.name || "Your Name");
      setBuilt(r);
      toast.success("ATS-friendly resume drafted", { description: `Score ${r.ats}/100 for ${role}` });
    } catch (e) {
      toast.error("Build failed", { description: String((e as Error).message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  const genCover = async () => {
    setBusy(true);
    try {
      const c = await mockCoverLetter(coverRole, coverCompany);
      setCover(c);
      toast.success("Cover letter drafted");
    } catch (e) {
      toast.error("Draft failed", { description: String((e as Error).message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  const translate = async () => {
    setBusy(true);
    try {
      const t = await mockTranslateResume(lang);
      setTranslated(t);
      toast.success(`Translated to ${lang}`);
    } catch (e) {
      toast.error("Translation failed", { description: String((e as Error).message ?? e) });
    } finally {
      setBusy(false);
    }
  };


  return (
    <div>
      <PageHeader
        eyebrow="Resume Studio"
        title="Resume, cover letter & translation"
        subtitle="Everything in one place — parse your existing resume, build an ATS-friendly one for a target role, draft cover letters, and translate."
      />

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="bg-brand-surface border border-brand-border">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="cover">Cover Letter</TabsTrigger>
          <TabsTrigger value="translate">Translator</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <div className="grid lg:grid-cols-3 gap-6">
            <Panel eyebrow="Upload" title="Drop your resume" className="lg:col-span-2">
              <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-brand-border bg-brand-bg py-12 cursor-pointer hover:border-brand-accent transition">
                <Upload className="h-7 w-7 text-brand-accent" />
                <div className="text-sm text-foreground">
                  {busy ? "Parsing…" : parsed ? parsed.fileName : "Drop PDF, DOCX, TXT or MD"}
                </div>
                <div className="mono-label">or click to browse</div>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </label>

              {parsed && (
                <div className="mt-6 rounded-xl border border-brand-border bg-brand-bg p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-success" />
                    <span className="mono-label text-brand-success">Agent Extracted</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <Field label="Name" value={parsed.fullName} />
                    <Field label="Email" value={parsed.email} />
                    <Field label="Phone" value={parsed.phone} />
                    <Field label="Location" value={parsed.location} />
                  </div>
                  <div>
                    <div className="mono-label mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {parsed.skills.map((s) => (
                        <Badge key={s} variant="outline" className="border-brand-border">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-brand-border">
                    <Button className="gap-2" onClick={() => toast.success("Agent rewrite complete (mock)")}>
                      <Wand2 className="h-4 w-4" /> Optimize with Agent
                    </Button>
                  </div>
                </div>
              )}
            </Panel>

            <div className="space-y-4">
              <Panel eyebrow="Score" title="ATS compatibility" className="text-center">
                <div className="flex flex-col items-center">
                  <AtsRadial score={candidateProfile.atsScore} />
                  <p className="text-sm text-muted-foreground mt-6">
                    {candidateProfile.atsScore}% keyword match for senior frontend roles.
                  </p>
                </div>
              </Panel>

              <Panel eyebrow="Insights" title="Improve">
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-brand-success shrink-0" /> Strong keyword coverage
                  </li>
                  <li className="flex gap-2 text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-brand-warning shrink-0" /> Add measurable metrics
                  </li>
                  <li className="flex gap-2 text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-brand-warning shrink-0" /> Missing: System Design, Rust
                  </li>
                </ul>
              </Panel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <Panel eyebrow="ATS-friendly Resume Builder" title="Tailor a resume to your target role" action={<Sparkles className="h-4 w-4 text-brand-accent" />}>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-6">
              <div className="space-y-2">
                <Label>Applying for</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer at Netflix" className="bg-brand-bg border-brand-border" />
              </div>
              <div className="flex items-end">
                <Button onClick={build} disabled={busy} className="gap-2 w-full sm:w-auto">
                  <Wand2 className="h-4 w-4" /> {busy ? "Drafting…" : "Build ATS resume"}
                </Button>
              </div>
            </div>

            {built && (
              <div className="rounded-xl border border-brand-border bg-brand-bg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mono-label">ATS score for {built.role}</div>
                    <div className="text-3xl font-bold text-foreground tabular-nums">{built.ats}<span className="text-sm text-muted-foreground">/100</span></div>
                  </div>
                  <Button variant="outline" onClick={() => toast.success("Downloaded (mock)")}>Download .docx</Button>
                </div>
                <p className="text-sm text-muted-foreground">{built.summary}</p>
                <div className="space-y-3">
                  {Object.entries(built.sections).map(([k, v]) => (
                    <div key={k}>
                      <div className="mono-label mb-1">{k}</div>
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{v as string}</pre>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-brand-border">
                  <div className="mono-label mb-2">Why this is ATS-friendly</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {built.tips.map((t) => <li key={t}>· {t}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="cover">
          <Panel eyebrow="AI Cover Letter" title="Draft a role-specific cover letter" action={<Mail className="h-4 w-4 text-brand-accent" />}>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={coverRole} onChange={(e) => setCoverRole(e.target.value)} className="bg-brand-bg border-brand-border" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={coverCompany} onChange={(e) => setCoverCompany(e.target.value)} className="bg-brand-bg border-brand-border" />
              </div>
              <div className="flex items-end">
                <Button onClick={genCover} disabled={busy} className="w-full">{busy ? "Drafting…" : "Generate"}</Button>
              </div>
            </div>
            <Textarea rows={14} value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Your generated cover letter will appear here…" className="bg-brand-bg border-brand-border font-sans" />
            {cover && (
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(cover); toast.success("Copied"); }}>Copy</Button>
                <Button variant="outline" onClick={() => toast.success("Downloaded (mock)")}>Download .txt</Button>
              </div>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="translate">
          <Panel eyebrow="Resume Translator" title="Translate your resume for global roles" action={<Languages className="h-4 w-4 text-brand-accent" />}>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-4">
              <div className="space-y-2">
                <Label>Target language</Label>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger className="bg-brand-bg border-brand-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Spanish", "French", "German", "Japanese", "Portuguese", "Hindi"].map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={translate} disabled={busy} className="w-full sm:w-auto">{busy ? "Translating…" : "Translate"}</Button>
              </div>
            </div>

            {translated && (
              <div className="rounded-xl border border-brand-border bg-brand-bg p-5">
                <div className="mono-label mb-2">{translated.language} · {translated.code}</div>
                <p className="text-sm text-foreground leading-relaxed">{translated.preview}</p>
                <p className="mono-label !text-[10px] mt-3 text-brand-success">{translated.note}</p>
              </div>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="mono-label">{label}</div>
      <div className="text-foreground text-sm">{value ?? "—"}</div>
    </div>
  );
}
