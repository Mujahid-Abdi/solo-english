import {
  Award, Bell, Camera, Flame, GraduationCap,
  Loader2, Save, Sparkles, Trophy,
} from "lucide-react";
import { useRef, useState } from "react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/data/mockUser";
import { useAuth } from "@/context/AuthContext";
import { upsertProfile } from "@/lib/profiles";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import type { LearnerProfile } from "@/types/user";

export function ProfilePage({ learner }: { learner: LearnerProfile }) {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(
    profile?.full_name ?? user?.user_metadata?.full_name ?? learner.name,
  );
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_minutes ?? learner.dailyGoalMinutes);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayXp    = profile?.xp            ?? learner.xp;
  const streak       = profile?.streak_days   ?? learner.streakDays;
  const longest      = profile?.longest_streak ?? learner.longestStreak;
  const lessonsDone  = profile?.lessons_completed ?? learner.lessonsCompleted;

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file, "solo-english/avatars");
      setAvatarUrl(url);
      await upsertProfile({ id: user.id, email: user.email ?? "", full_name: fullName, avatar_url: url });
      // also update auth metadata
      await supabase.auth.updateUser({ data: { avatar_url: url } });
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await upsertProfile({
        id: user.id,
        email: user.email ?? "",
        full_name: fullName,
        avatar_url: avatarUrl,
        daily_goal_minutes: dailyGoal,
      });
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      {/* left column */}
      <section className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            {/* avatar with upload */}
            <div className="relative mx-auto w-fit">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/30"
                />
              ) : (
                <UserAvatar name={fullName} className="mx-auto h-24 w-24 text-2xl" />
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow hover:bg-primary/80 transition"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload avatar"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <h1 className="mt-4 text-3xl font-black">{fullName}</h1>
            <p className="mt-1 font-semibold text-muted-foreground">
              {user?.email ?? "Guest"} · English A1
            </p>

            {/* edit form */}
            <form className="mt-5 space-y-3 text-left" onSubmit={handleSave}>
              <label className="grid gap-1 text-sm font-bold">
                Display name
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Daily goal (minutes)
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="h-10 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              {error && (
                <p className="text-xs font-semibold text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={saving || !user}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <Bell className="mt-0.5 h-6 w-6 text-primary" aria-hidden />
            <div>
              <h2 className="font-black">Notifications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Push notifications will be added in a later phase.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* right column */}
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileStat icon={Sparkles}      label="Total XP"       value={displayXp.toLocaleString()} />
          <ProfileStat icon={Flame}         label="Current streak" value={`${streak} days`} />
          <ProfileStat icon={Trophy}        label="Longest streak" value={`${longest} days`} />
          <ProfileStat icon={GraduationCap} label="Lessons done"   value={String(lessonsDone)} />
        </div>

        <Card>
          <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span>A1 progress</span><span>35%</span>
              </div>
              <Progress value={35} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm font-bold text-muted-foreground">Words learned</p>
                <p className="text-2xl font-black">{profile?.words_learned ?? learner.wordsLearned}</p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm font-bold text-muted-foreground">Certificates</p>
                <p className="text-2xl font-black">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {achievements.map((a) => (
              <div key={a.id} className="rounded-xl border bg-background p-4">
                <Award className={a.earned ? "h-7 w-7 text-secondary" : "h-7 w-7 text-muted-foreground"} aria-hidden />
                <h3 className="mt-3 font-black">{a.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{a.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="h-7 w-7 text-primary" aria-hidden />
        <p className="mt-3 text-sm font-bold text-muted-foreground">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </CardContent>
    </Card>
  );
}
