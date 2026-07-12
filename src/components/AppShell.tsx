import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export function AppShell({
  brandBadge,
  brandName,
  nav,
  children,
}: {
  brandBadge: string;
  brandName: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-brand-bg text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-brand-border bg-[#0d131a]">
        <Link to="/" className="flex items-center gap-3 px-5 h-16 border-b border-brand-border">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-accent/15 text-brand-accent font-bold">
            {brandBadge}
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">AIHire Pro</div>
            <div className="mono-label !text-[9px]">{brandName}</div>
          </div>
        </Link>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-brand-surface text-white border border-brand-border"
                    : "text-slate-400 hover:text-white hover:bg-brand-surface/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-brand-border">
          <div className="mono-label mb-2">Session</div>
          <div className="rounded-lg bg-brand-surface border border-brand-border p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-brand-success animate-pulse" />
              <span className="font-medium text-white">Local demo</span>
            </div>
            <div className="text-muted-foreground text-[11px]">
              AI mocked · no backend
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-brand-border bg-brand-bg/80 backdrop-blur flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <span className="grid place-items-center h-7 w-7 rounded bg-brand-accent/15 text-brand-accent text-xs font-bold">
              {brandBadge}
            </span>
            <span className="text-sm font-semibold">AIHire Pro</span>
          </div>
          <div className="hidden md:block mono-label">
            {brandName} / {pathname}
          </div>
          <div className="flex items-center gap-3 pr-16 md:pr-20">
            <span className="mono-label hidden sm:inline">
              GPT-OSS-120B · <span className="text-brand-warning">MOCKED</span>
            </span>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && <div className="mono-label mb-2">{eyebrow}</div>}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-brand-border bg-brand-surface p-6",
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <header className="flex items-start justify-between mb-4">
          <div>
            {eyebrow && <div className="mono-label mb-1">{eyebrow}</div>}
            {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  accent = "accent",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "accent" | "success" | "warning" | "danger";
}) {
  const accentClass = {
    accent: "text-brand-accent",
    success: "text-brand-success",
    warning: "text-brand-warning",
    danger: "text-brand-danger",
  }[accent];
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
      <div className="mono-label">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">{value}</div>
      {hint && <div className={cn("mt-1 text-xs", accentClass)}>{hint}</div>}
    </div>
  );
}
