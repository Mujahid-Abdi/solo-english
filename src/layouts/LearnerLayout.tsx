import { Bell, Crown, Dumbbell, Home, LogOut, Medal, Route, Settings, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import type React from "react";
import { Logo } from "@/components/brand/Logo";
import { StatPill } from "@/components/common/StatPill";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import type { LearnerProfile } from "@/types/user";

export type LearnerRoute = "home" | "learn" | "practice" | "leaderboard" | "profile";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: Route },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "leaderboard", label: "League", icon: Trophy },
  { id: "profile", label: "Profile", icon: Medal },
] as const;

interface LearnerLayoutProps {
  learner: LearnerProfile;
  route: LearnerRoute;
  children: React.ReactNode;
  onRouteChange: (route: LearnerRoute) => void;
  onAdmin: () => void;
  onSignOut: () => void;
}

export function LearnerLayout({ learner, route, children, onRouteChange, onAdmin, onSignOut }: LearnerLayoutProps) {
  const { user, profile, isAdmin } = useAuth();
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? learner.name;
  const displayXp = profile?.xp ?? learner.xp;
  const isChild = learner.ageGroup === "under-15";
  const isLearningWorld = route === "learn";

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        isChild && !isLearningWorld && "bg-[linear-gradient(180deg,#fff7ed_0%,#ecfeff_52%,#f8fafc_100%)]",
        isLearningWorld && "bg-[#0f1f24]",
      )}
    >
      <aside className={cn("fixed inset-y-0 left-0 hidden w-64 border-r bg-card p-4 lg:block", isLearningWorld && "border-[#31464f] bg-[#0f1f24] text-slate-50")}>
        <Logo />
        <nav className="mt-8 grid gap-2" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={route === item.id ? "default" : "ghost"}
              className="justify-start"
              onClick={() => onRouteChange(item.id)}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Button>
          ))}
          {isAdmin && (
            <Button variant="ghost" className="justify-start" onClick={onAdmin}>
              <Crown className="h-5 w-5 text-yellow-500" aria-hidden />
              Admin Panel
            </Button>
          )}
        </nav>
        <div className={cn("absolute bottom-4 left-4 right-4 rounded-lg border bg-muted/45 p-4", isLearningWorld && "border-[#31464f] bg-[#122126]")}>
          <div className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            {isChild ? "Safe learner mode" : "Premium ready"}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {isChild ? "Public chat and open profiles are disabled in this experience." : "Subscription, certificates, and advanced reports can plug in later."}
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className={cn("sticky top-0 z-30 border-b bg-background/90 backdrop-blur", isLearningWorld && "border-[#31464f] bg-[#0f1f24]/95 text-slate-50")}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Logo compact className="lg:hidden" />
            <div className="hidden min-w-0 lg:block">
              <p className="text-sm font-semibold text-muted-foreground">Welcome back</p>
              <h1 className="truncate text-xl font-black">{displayName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatPill icon={Sparkles} label="XP" value={`${displayXp.toLocaleString()} XP`} />
              <StatPill icon={Trophy} label="Streak" value={`${learner.streakDays} days`} className="hidden sm:flex" />
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              {isAdmin && (
                <Button variant="outline" size="icon" aria-label="Admin panel" onClick={onAdmin}>
                  <Settings className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                aria-label="Sign out"
                onClick={async () => { await signOut(); onSignOut(); }}
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <UserAvatar name={displayName} />
            </div>
          </div>
        </header>

        <main className={cn("mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:pb-8", isLearningWorld && "max-w-none")}>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card px-2 py-2 lg:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-md text-xs font-extrabold text-muted-foreground",
                route === item.id && "bg-primary text-primary-foreground",
              )}
              onClick={() => onRouteChange(item.id)}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
