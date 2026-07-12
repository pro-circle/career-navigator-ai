import { cn } from "@/lib/utils";

export function AtsRadial({
  score,
  label = "ATS Score",
  size = 192,
  accent = "accent",
}: {
  score: number;
  label?: string;
  size?: number;
  accent?: "accent" | "success" | "warning";
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;
  const color = {
    accent: "text-brand-accent",
    success: "text-brand-success",
    warning: "text-brand-warning",
  }[accent];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-brand-border"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          className={cn("transition-all duration-700", color)}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white tracking-tighter tabular-nums">{clamped}</div>
          <div className="mono-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function MatchBar({ value, label, accent = "accent" }: { value: number; label?: string; accent?: "accent" | "success" }) {
  const color = accent === "success" ? "bg-brand-success" : "bg-brand-accent";
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-300">{label}</span>
          <span className="font-mono text-white tabular-nums">{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
