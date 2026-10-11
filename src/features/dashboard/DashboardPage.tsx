import {
  ArrowRight, BookOpenCheck, Crown, Flame,
  Headphones, Sparkles, Target, Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockCourse";
import { quests } from "@/data/mockUser";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Course } from "@/types/course";
import type { LearnerProfile, Quest } from "@/types/user";

export function DashboardPage({ learner, course }: { learner: LearnerProfile; course: Course }) {
  const { user, profile, isAdmin } = useAuth();
  const isChild = learner.ageGroup === "under-15";
  const activeLevel = course.levels[0] ?? courses[0].levels[0];

  // Prefer real profile data when available, fall back to mock
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? learner.name;
  const displayXp = profile?.xp ?? learner.xp;
  const displayStreak = profile?.streak_days ?? learner.streakDays;
  const dailyMinutes = learner.dailyMinutes;
  const dailyGoal = profile?.daily_goal_minutes ?? learner.dailyGoalMinutes;

  return (
    <div className={cn("grid gap-6", isChild ? "lg:grid-cols-[1fr_0.8fr]" : "lg:grid-cols-[1.1fr_0.9fr]")}>
      <section className="space-y-6">

        {/* Super admin badge */}
        {isAdmin && (
          <div className="flex items-center gap-3 rounded-2xl border border-yellow-400 bg-yellow-50 px-5 py-3 animate-fade-in">
            <Crown className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-sm font-black text-yellow-700">Super Admin</p>
              <p className="text-xs text-yellow-600">You have full access to the admin panel.</p>
            </div>
          </div>
        )}

        {/* Welcome card */}
        <Card className={cn(isChild && "border-secondary bg-white")}>
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold text-muted-foreground">Current progress</p>
                <h2 className={cn("mt-1 font-black", isChild ? "text-4xl" : "text-3xl")}>
                  Welcome back, {displayName.split(" ")[0]} 👋
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {activeLevel.cefr} · {activeLevel.title}
                </p>
              </div>
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-8 border-primary bg-primary/10 text-2xl font-black text-primary">
                {activeLevel.progress}%
              </div>
            </div>
            <Progress value={activeLevel.progress} className="mt-6" />
          </CardContent>
        </Card>

        {/* Continue lesson */}
        <Card>
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between gap-4 rounded-xl border bg-muted/40 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <BookOpenCheck className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground">Greetings · Lesson 3</p>
                  <h3 className="text-xl font-black">Numbers in daily English</h3>
                </div>
              </div>
              <Button className="shrink-0">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {isChild && <ChildJourney />}
      </section>

      {/* right sidebar */}
      <aside className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <Metric icon={Target} label="Daily goal" value={`${dailyMinutes} / ${dailyGoal} min`} />
          <Metric icon={Flame} label="Streak" value={`${displayStreak} days`} />
          <Metric icon={Sparkles} label="XP earned" value={`${displayXp.toLocaleString()} XP`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily quests</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for you</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border bg-background p-4">
              <Headphones className="h-7 w-7 text-primary" aria-hidden />
              <h3 className="mt-3 font-black">Listen and choose: greetings</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Short listening practice based on your current A1 unit.
              </p>
              <Button variant="default" className="mt-4 w-full">Start practice</Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <Icon className="h-7 w-7 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-extrabold">{quest.title}</p>
        <span className="text-sm font-black text-primary">+{quest.rewardXp} XP</span>
      </div>
      <Progress value={(quest.progress / quest.target) * 100} className="mt-3" />
    </div>
  );
}

function ChildJourney() {
  return (
    <Card className="border-secondary">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-secondary" aria-hidden />
          <h2 className="text-2xl font-black">Today's reward path</h2>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {["Start", "Words", "Listen", "Prize"].map((item, i) => (
            <div
              key={item}
              className={cn(
                "rounded-xl border-2 p-4 text-center font-black",
                i < 2 ? "border-primary bg-primary/10" : "border-border bg-muted/50",
              )}
            >
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
