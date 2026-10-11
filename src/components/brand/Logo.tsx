import { BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="Solo English">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_4px_0_hsl(164_82%_25%)]">
        <BookOpenCheck className="h-6 w-6" />
      </div>
      {!compact ? (
        <div>
          <div className="text-lg font-black leading-tight">Solo English</div>
          <div className="text-xs font-semibold text-muted-foreground">English for Ethiopia</div>
        </div>
      ) : null}
    </div>
  );
}
