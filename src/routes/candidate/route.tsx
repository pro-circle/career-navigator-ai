import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, FileText, GraduationCap, LayoutDashboard, Link2, Mic, Route as RouteIcon, Sparkles } from "lucide-react";

import { AppShell, type NavItem } from "@/components/AppShell";
import { AiChatDock } from "@/components/AiChatDock";

const baseNav: NavItem[] = [
  { to: "/candidate", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidate/resume", label: "Resume Studio", icon: FileText },
  { to: "/candidate/jobs", label: "Job Match", icon: Sparkles },
  { to: "/candidate/external", label: "External Analyzer", icon: Link2 },
  { to: "/candidate/interview", label: "Mock Interview", icon: Mic },
  { to: "/candidate/portfolio", label: "Profile", icon: GraduationCap },
  { to: "/candidate/assistant", label: "Personal Trainee", icon: Bot },
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
  const [nav, setNav] = useState<NavItem[]>(baseNav);

  useEffect(() => {
    const done = typeof window !== "undefined" && localStorage.getItem("interview_completed") === "1";
    if (done) {
      setNav([
        ...baseNav.slice(0, 5),
        { to: "/candidate/roadmap", label: "Prep Roadmap", icon: RouteIcon },
        ...baseNav.slice(5),
      ]);
    }
  }, []);

  return (
    <>
      <AppShell brandBadge="C" brandName="Candidate" nav={nav}>
        <Outlet />
      </AppShell>
      <AiChatDock
        persona="Personal Trainee"
        suggestions={["Why is my ATS score 84?", "Should I apply to Netflix?", "What projects should I build next?"]}
      />
    </>
  );
}
