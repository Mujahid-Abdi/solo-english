import { cn } from "@/lib/utils";

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn("grid h-11 w-11 place-items-center rounded-full bg-accent text-sm font-black text-accent-foreground", className)}
      aria-label={`${name} profile`}
    >
      {initials}
    </div>
  );
}
