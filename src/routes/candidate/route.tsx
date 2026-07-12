import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bot, FileText, GraduationCap, LayoutDashboard, Link2, Mic, Route as RouteIcon, Sparkles, UserCircle } from "lucide-react";

import { AppShell, type NavItem } from "@/components/AppShell";
import { AiChatDock } from "@/components/AiChatDock";

const nav: NavItem[] = [
  { to: "/candidate", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidate/resume", label: "Resume", icon: FileText },
  { to: "/candidate/jobs", label: "Job Match", icon: Sparkles },
  { to: "/candidate/external", label: "External Analyzer", icon: Link2 },
  { to: "/candidate/interview", label: "Mock Interview", icon: Mic },
  { to: "/candidate/roadmap", label: "Prep Roadmap", icon: RouteIcon },
  { to: "/candidate/portfolio", label: "Portfolio", icon: GraduationCap },
  { to: "/candidate/assistant", label: "AI Coach", icon: Bot },
];

export const Route = createFileRoute("/candidate")({
  head: () => ({
    meta: [
      { title: "Candidate Portal — AIHire Pro" },
      { name: "description", content: "Score your resume, practice interviews, and plan your prep." },
    ],
  }),
  component: CandidateLayout,
});

function CandidateLayout() {
  return (
    <>
      <AppShell brandBadge="C" brandName="Candidate" nav={nav}>
        <Outlet />
      </AppShell>
      <AiChatDock
        persona="Career Coach"
        suggestions={["Why is my ATS score 84?", "Should I apply to Netflix?", "What projects should I build next?"]}
      />
    </>
  );
}

// Silence unused import warning in some tsconfig setups
void UserCircle;
