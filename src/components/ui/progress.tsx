import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  label?: string;
  className?: string;
}

export function Progress({ value, label, className }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      {label ? <div className="mb-2 text-sm font-semibold text-muted-foreground">{label}</div> : null}
      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn("h-full rounded-full bg-primary transition-all")} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
