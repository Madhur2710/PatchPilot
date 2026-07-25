import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
