import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminShell }      from "@/features/admin/AdminShell";
import { AuthFlow }        from "@/features/auth/AuthFlow";
import { DashboardPage }   from "@/features/dashboard/DashboardPage";
import { LandingPage }     from "@/features/landing/LandingPage";
import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage";
import { LearnPage }       from "@/features/learning/LearnPage";
import { OnboardingFlow }  from "@/features/onboarding/OnboardingFlow";
import { PracticePage }    from "@/features/practice/PracticePage";
import { ProfilePage }     from "@/features/profile/ProfilePage";
import { LearnerLayout, type LearnerRoute } from "@/layouts/LearnerLayout";
import { courses }         from "@/data/mockCourse";
import { learner as baseLearner } from "@/data/mockUser";
import { useAuth }         from "@/context/AuthContext";
import { upsertProfile }   from "@/lib/profiles";
import type { AgeGroup, LearningGoal, SourceLanguage } from "@/types/course";

// ─── flow steps ────────────────────────────────────────────────────
// landing → auth → (sign-up only) onboarding → learner / admin
type AppMode = "landing" | "auth" | "onboarding" | "learner" | "admin";

export interface OnboardingState {
  sourceLanguage: SourceLanguage;
  ageGroup: AgeGroup;
  goal: LearningGoal;
}

export function App() {
  const { session, user, profile, isAdmin, loading } = useAuth();

  const [mode, setMode]           = useState<AppMode>("landing");
  const [route, setRoute]         = useState<LearnerRoute>("home");
  const [onboarding, setOnboarding] = useState<OnboardingState>({
    sourceLanguage: "afaan-oromo",
    ageGroup: "15-plus",
    goal: "speak-confidently",
  });

  // If user is already signed in when app loads, skip to learner
  useEffect(() => {
    if (loading) return;
    if (session && (mode === "landing" || mode === "auth")) {
      setMode(isAdmin ? "admin" : "learner");
    }
  }, [loading, session]);

  const learner = useMemo(() => ({
    ...baseLearner,
    id:             user?.id ?? baseLearner.id,
    name:           profile?.full_name ?? user?.user_metadata?.full_name ?? baseLearner.name,
    sourceLanguage: (profile?.source_language ?? onboarding.sourceLanguage) as SourceLanguage,
    ageGroup:       (profile?.age_group       ?? onboarding.ageGroup)       as AgeGroup,
    goal:           (profile?.goal            ?? onboarding.goal)           as LearningGoal,
    xp:             profile?.xp          ?? baseLearner.xp,
    streakDays:     profile?.streak_days ?? baseLearner.streakDays,
  }), [onboarding, user, profile]);

  const course = courses.find((c) => c.sourceLanguage === learner.sourceLanguage) ?? courses[0];

  // ── loading spinner ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── landing ────────────────────────────────────────────────────
  if (mode === "landing") {
    return (
      <LandingPage
        onStart={()   => setMode("auth")}          // → auth first
        onExplore={()  => { setMode("learner"); setRoute("home"); }}
        onAdmin={()    => setMode("admin")}
      />
    );
  }

  // ── auth (sign in / sign up) ───────────────────────────────────
  if (mode === "auth") {
    return (
      <AuthFlow
        onBack={()    => setMode("landing")}
        onGuest={()   => setMode("learner")}
        // Existing user signed in → go straight to dashboard
        onSignedIn={async () => {
          setMode(isAdmin ? "admin" : "learner");
        }}
        // New user signed up → collect preferences first
        onSignedUp={() => setMode("onboarding")}
      />
    );
  }

  // ── onboarding questions (sign-up only) ───────────────────────
  if (mode === "onboarding") {
    return (
      <OnboardingFlow
        value={onboarding}
        onChange={setOnboarding}
        onBack={() => setMode("auth")}
        onComplete={async () => {
          // Save preferences to Supabase profile
          if (user) {
            try {
              await upsertProfile({
                id:                 user.id,
                email:              user.email ?? "",
                full_name:          user.user_metadata?.full_name ?? "",
                avatar_url:         null,
                source_language:    onboarding.sourceLanguage,
                age_group:          onboarding.ageGroup,
                goal:               onboarding.goal,
                xp:                 0,
                streak_days:        0,
                longest_streak:     0,
                lessons_completed:  0,
                words_learned:      0,
                daily_goal_minutes: 10,
              });
            } catch {
              // non-fatal
            }
          }
          setMode(isAdmin ? "admin" : "learner");
        }}
      />
    );
  }

  // ── admin ──────────────────────────────────────────────────────
  if (mode === "admin") {
    return <AdminShell onExit={() => setMode(session ? "learner" : "landing")} />;
  }

  // ── learner app ────────────────────────────────────────────────
  return (
    <LearnerLayout
      learner={learner}
      route={route}
      onRouteChange={setRoute}
      onAdmin={()    => setMode("admin")}
      onSignOut={()  => setMode("landing")}
    >
      {route === "home"        && <DashboardPage   learner={learner} course={course} />}
      {route === "learn"       && <LearnPage        course={course} ageGroup={learner.ageGroup} />}
      {route === "practice"    && <PracticePage     ageGroup={learner.ageGroup} />}
      {route === "leaderboard" && <LeaderboardPage  ageGroup={learner.ageGroup} />}
      {route === "profile"     && <ProfilePage      learner={learner} />}
    </LearnerLayout>
  );
}
