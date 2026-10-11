import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export function StatPill({ icon: Icon, label, value, className }: StatPillProps) {
  return (
    <div className={cn("flex min-h-11 items-center gap-2 rounded-md border bg-card px-3", className)}>
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
}
