import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, Panel, Stat } from "@/components/AppShell";
import { analytics } from "@/lib/mock-data";

export const Route = createFileRoute("/recruiter/analytics")({
  head: () => ({
    meta: [
      { title: "Recruitment Analytics — AIHire Pro" },
      { name: "description", content: "Applications, sources, skills, and time-to-hire — visualized." },
    ],
  }),
  component: AnalyticsPage,
});

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Recruitment analytics"
        subtitle="Every dashboard your hiring team needs — sources, funnel, geography, and skill distribution."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Applications" value={492} hint="+12% MoM" />
        <Stat label="Conversion" value="30%" hint="Screen → Interview" accent="success" />
        <Stat label="Time to hire" value={`${analytics.timeToHireDays}d`} hint="−3d vs. Q2" accent="warning" />
        <Stat label="Offer accept" value="78%" hint="+4pp" accent="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel eyebrow="Trend" title="Applications by week" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.applicationsByWeek}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#151B23", border: "1px solid #2D3748", borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="url(#a1)" />
                <Area type="monotone" dataKey="shortlisted" stroke="#10B981" fill="url(#a2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Sources" title="Where applicants come from">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.sources} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {analytics.sources.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#0A0F14" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#151B23", border: "1px solid #2D3748", borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-1.5">
            {analytics.sources.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="h-2 w-2 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                  {s.name}
                </span>
                <span className="font-mono text-white tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Skills" title="Applicant skill distribution" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="skill" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#151B23", border: "1px solid #2D3748", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Geography" title="Applicant regions">
          <div className="space-y-2 text-sm">
            {[
              { region: "North America", pct: 42 },
              { region: "Europe", pct: 31 },
              { region: "Asia", pct: 18 },
              { region: "South America", pct: 6 },
              { region: "Other", pct: 3 },
            ].map((r) => (
              <div key={r.region}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{r.region}</span>
                  <span className="font-mono text-white">{r.pct}%</span>
                </div>
                <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
