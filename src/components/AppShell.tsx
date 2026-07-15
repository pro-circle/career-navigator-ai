import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      {/* Retractable sidebar (Supabase-style hover-to-expand overlay) */}
      <div className="hidden md:block w-[64px] shrink-0 relative">
        <aside
          className="group/sidebar fixed top-0 left-0 z-40 h-screen w-[64px] hover:w-60 focus-within:w-60 transition-[width] duration-200 ease-out border-r border-brand-border bg-[#0d131a] overflow-hidden flex flex-col shadow-none hover:shadow-2xl hover:shadow-black/40"
        >
          <Link to="/" className="flex items-center gap-3 px-4 h-16 border-b border-brand-border shrink-0">
            <span className="grid place-items-center h-8 w-8 shrink-0 rounded-lg bg-brand-accent/15 text-brand-accent font-bold">
              {brandBadge}
            </span>
            <div className="leading-tight opacity-0 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
              <div className="text-sm font-semibold text-foreground">AIHire Pro</div>
              <div className="mono-label !text-[9px]">{brandName}</div>
            </div>
          </Link>
          <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto chat-scroll">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand-surface text-foreground border border-brand-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-brand-surface/60",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="opacity-0 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-brand-border shrink-0">
            <div className="rounded-lg bg-brand-surface border border-brand-border p-2.5 text-xs flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-success animate-pulse" />
              <div className="opacity-0 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                <div className="font-medium text-foreground">Local demo</div>
                <div className="text-muted-foreground text-[10px]">Agentic AI · server-side</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

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
              Agentic AI · <span className="text-brand-success">ONLINE</span>
            </span>
            <ThemeToggle />
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
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
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
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
      <div className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">{value}</div>
      {hint && <div className={cn("mt-1 text-xs", accentClass)}>{hint}</div>}
    </div>
  );
}
