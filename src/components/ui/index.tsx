import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("card p-5 animate-fade-in", className)}>{children}</div>;
}

export function ProgressBar({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "bull" | "gold";
}) {
  const toneMap = {
    accent: "bg-accent",
    bull: "bg-bull",
    gold: "bg-gold",
  };
  return (
    <div className={cn("h-2 w-full rounded-full bg-bg-soft overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneMap[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "bull" | "bear" | "accent" | "gold";
  className?: string;
}) {
  const map = {
    neutral: "bg-bg-soft text-muted",
    bull: "bg-bull-soft text-bull-strong",
    bear: "bg-bear-soft text-bear-strong",
    accent: "bg-accent-soft text-accent",
    gold: "bg-gold/15 text-gold",
  };
  return <span className={cn("badge", map[tone], className)}>{children}</span>;
}

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "neutral" | "bull" | "bear" | "accent" | "gold";
}) {
  const valueColor = {
    neutral: "text-white",
    bull: "text-bull-strong",
    bear: "text-bear-strong",
    accent: "text-accent",
    gold: "text-gold",
  }[tone];
  return (
    <div className="stat-card">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <span className={cn("text-2xl font-bold font-mono", valueColor)}>{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}

export function Callout({
  tone,
  title,
  children,
}: {
  tone: "info" | "bull" | "bear" | "warning";
  title: string;
  children: ReactNode;
}) {
  const map = {
    info: "border-accent/40 bg-accent-soft",
    bull: "border-bull/40 bg-bull-soft",
    bear: "border-bear/40 bg-bear-soft",
    warning: "border-gold/40 bg-gold/10",
  };
  const icon = { info: "ℹ", bull: "▲", bear: "▼", warning: "⚠" };
  return (
    <div className={cn("rounded-lg border p-4 my-3", map[tone])}>
      <div className="flex items-center gap-2 font-semibold text-white mb-1">
        <span>{icon[tone]}</span>
        <span>{title}</span>
      </div>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-10 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
