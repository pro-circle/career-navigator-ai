import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PageHeader, Panel } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { candidates, jobs, useLiveDataVersion } from "@/lib/mock-data";
import { MatchBar } from "@/components/AtsRadial";

export const Route = createFileRoute("/recruiter/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — AIHire Pro" },
      { name: "description", content: "Browse and filter all applicants across every role." },
    ],
  }),
  component: CandidatesPage,
});

function CandidatesPage() {
  useLiveDataVersion();
  const [q, setQ] = useState("");

  const [job, setJob] = useState<string>("all");
  const [sort, setSort] = useState<"match" | "ats" | "portfolio" | "experience">("match");

  const filtered = useMemo(() => {
    let list = candidates;
    if (job !== "all") list = list.filter((c) => c.appliedJobId === job);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(ql) || c.skills.some((s) => s.toLowerCase().includes(ql)),
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "match") return b.matchScore - a.matchScore;
      if (sort === "ats") return b.atsScore - a.atsScore;
      if (sort === "portfolio") return b.portfolioScore - a.portfolioScore;
      return b.yearsExperience - a.yearsExperience;
    });
  }, [q, job, sort]);

  return (
    <div>
      <PageHeader
        eyebrow="Talent Pool"
        title="Candidates"
        subtitle="Every applicant across every role, ranked and searchable."
      />

      <Panel>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or skill…"
              className="pl-9 bg-brand-bg border-brand-border"
            />
          </div>
          <Select value={job} onValueChange={setJob}>
            <SelectTrigger className="w-[220px] bg-brand-bg border-brand-border">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {jobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-[180px] bg-brand-bg border-brand-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match score</SelectItem>
              <SelectItem value="ats">ATS score</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to="/recruiter/candidates/$id"
              params={{ id: c.id }}
              className="group rounded-xl border border-brand-border bg-brand-bg p-5 hover:border-brand-accent/50 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-accent/15 grid place-items-center text-brand-accent text-xs font-semibold">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white truncate group-hover:text-brand-accent transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.headline}</div>
                </div>
                <Badge variant="outline" className="border-brand-border">
                  {c.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-3">
                <MatchBar label="Match" value={c.matchScore} />
                <MatchBar label="ATS" value={c.atsScore} accent="success" />
                <MatchBar label="Portfolio" value={c.portfolioScore} accent="success" />
              </div>
              <div className="flex flex-wrap gap-1">
                {c.skills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] rounded bg-brand-surface border border-brand-border px-1.5 py-0.5 uppercase tracking-wider text-slate-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
