import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, GraduationCap, Sparkles, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AIHire Pro — Agentic AI ATS + Career Prep" },
      {
        name: "description",
        content:
          "Choose your workspace. Recruiters rank candidates with agentic AI; candidates prepare with adaptive mock interviews and personalized roadmaps.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg text-foreground font-sans">
      <div
        className="fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.12), transparent 40%), radial-gradient(circle at 80% 90%, rgba(16,185,129,0.08), transparent 45%)",
        }}
      />

      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-brand-accent/15 text-brand-accent font-bold">
            A
          </span>
          <span className="font-semibold text-foreground">AIHire Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
            AIHire <span className="text-brand-accent">Pro</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The intelligent bridge between elite talent and high-growth teams — one platform for agentic AI recruitment
            and career preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <RoleCard
            to="/recruiter"
            accent="accent"
            icon={Briefcase}
            eyebrow="Recruiter Workspace"
            title="Rank, screen & hire faster."
            bullets={[
              "Semantic candidate matching with explainability",
              "Portfolio & hyperlink intelligence",
              "Compare candidates side-by-side",
              "Agent-generated interview questions",
            ]}
          />
          <RoleCard
            to="/candidate"
            accent="success"
            icon={GraduationCap}
            eyebrow="Candidate Portal"
            title="Score, practice & land the role."
            bullets={[
              "ATS score + resume optimizer",
              "Adaptive mock interviews with coding IDE",
              "External job URL analyzer",
              "Personalized preparation roadmap",
            ]}
          />
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {[
            { label: "Resumes parsed", value: "12,481", hint: "PDF · DOCX · TXT · MD" },
            { label: "Portfolios analyzed", value: "8,204", hint: "GitHub · Behance · Kaggle · Scholar" },
            { label: "Mock interviews", value: "3,910", hint: "Adaptive · voice + text" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-brand-border bg-brand-surface p-5">
              <div className="mono-label">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">{s.value}</div>
              <div className="text-xs text-brand-accent mt-1">{s.hint}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-brand-border mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-brand-accent" />
          Powered by Agentic AI · RAG · Live web search
        </div>
        <div className="mono-label">© 2026 AIHire Pro</div>
      </footer>
    </div>
  );
}

function RoleCard({
  to,
  accent,
  icon: Icon,
  eyebrow,
  title,
  bullets,
}: {
  to: string;
  accent: "accent" | "success";
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  bullets: string[];
}) {
  const color = accent === "accent" ? "text-brand-accent" : "text-brand-success";
  const bg = accent === "accent" ? "bg-brand-accent/10" : "bg-brand-success/10";
  const hover = accent === "accent" ? "hover:border-brand-accent/60" : "hover:border-brand-success/60";
  return (
    <Link
      to={to}
      className={`group block rounded-2xl border border-brand-border bg-brand-surface p-8 transition-all ${hover}`}
    >
      <div className={`w-12 h-12 rounded-xl ${bg} ${color} grid place-items-center mb-6`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mono-label mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      <ul className="space-y-2 mb-6">
        {bullets.map((b) => (
          <li key={b} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className={`mt-1.5 h-1 w-1 rounded-full ${accent === "accent" ? "bg-brand-accent" : "bg-brand-success"}`} />
            {b}
          </li>
        ))}
      </ul>
      <div className={`inline-flex items-center gap-2 font-medium ${color}`}>
        Enter workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

// suppress unused import when tree-shaken
void Sparkles;
