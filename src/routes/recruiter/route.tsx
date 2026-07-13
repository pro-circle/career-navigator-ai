import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3, Bot, GitCompare, LayoutDashboard, ListChecks, Users } from "lucide-react";
import { AppShell, type NavItem } from "@/components/AppShell";
import { AiChatDock } from "@/components/AiChatDock";
import { SettingsDrawer } from "@/components/settings/SettingsDrawer";


const nav: NavItem[] = [
  { to: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "Jobs", icon: ListChecks },
  { to: "/recruiter/candidates", label: "Candidates", icon: Users },
  { to: "/recruiter/compare", label: "Compare", icon: GitCompare },
  { to: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/recruiter/assistant", label: "AI Assistant", icon: Bot },
];

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Recruiter Workspace — AIHire Pro" },
      { name: "description", content: "Rank candidates, analyze portfolios, and run explainable AI-powered hiring." },
    ],
  }),
  component: RecruiterLayout,
});

function RecruiterLayout() {
  return (
    <>
      <AppShell brandBadge="R" brandName="Recruiter" nav={nav}>
        <Outlet />
      </AppShell>
      <AiChatDock
        persona="Recruiter Intelligence"
        suggestions={["Summarize top 5 candidates", "Compare Elena vs Marcus", "Draft interview questions for j-4029"]}
      />
      <SettingsDrawer />
    </>

  );
}
