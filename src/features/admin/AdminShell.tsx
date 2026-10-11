import {
  BarChart3, BookOpen, CheckCircle2, FileAudio, Gauge,
  Globe2, Layers, Library, ListChecks, Loader2,
  MessageSquareText, PenTool, Send, Users, Workflow, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/lib/profiles";

type AdminTab =
  | "dashboard"
  | "users"
  | "courses"
  | "levels"
  | "units"
  | "sections"
  | "lessons"
  | "exercises"
  | "audio"
  | "translations"
  | "review"
  | "publishing"
  | "analytics";

const adminNav: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",    label: "Dashboard",      icon: Gauge },
  { id: "users",        label: "Users",          icon: Users },
  { id: "courses",      label: "Courses",        icon: Library },
  { id: "levels",       label: "Levels",         icon: Layers },
  { id: "units",        label: "Units",          icon: BookOpen },
  { id: "sections",     label: "Sections",       icon: Workflow },
  { id: "lessons",      label: "Lessons",        icon: PenTool },
  { id: "exercises",    label: "Exercises",      icon: ListChecks },
  { id: "audio",        label: "Audio",          icon: FileAudio },
  { id: "translations", label: "Translations",   icon: Globe2 },
  { id: "review",       label: "Review Queue",   icon: MessageSquareText },
  { id: "publishing",   label: "Publishing",     icon: Send },
  { id: "analytics",    label: "Analytics",      icon: BarChart3 },
];

export function AdminShell({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-y-auto border-r bg-card p-4 xl:block">
        <Logo />
        <nav className="mt-8 grid gap-1" aria-label="Admin navigation">
          {adminNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-bold transition ${
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="xl:pl-72">
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div>
              <p className="text-sm font-bold text-muted-foreground">Super Admin</p>
              <h1 className="text-2xl font-black capitalize">{tab}</h1>
            </div>
            <Button variant="outline" onClick={onExit}>
              <X className="h-4 w-4" /> Exit
            </Button>
          </div>

          {/* mobile tab bar */}
          <div className="flex gap-1 overflow-x-auto px-4 pb-3 xl:hidden">
            {adminNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  tab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "users"     && <AdminUsers />}
          {tab !== "dashboard" && tab !== "users" && <ComingSoon tab={tab} />}
        </main>
      </div>
    </div>
  );
}

/* ── Dashboard tab ───────────────────────────────────────────── */
function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setUserCount(count ?? 0));
  }, []);

  const stats = [
    { label: "Total users",         value: userCount !== null ? String(userCount) : "…",  trend: "Registered learners" },
    { label: "Total courses",        value: "2",   trend: "Afaan Oromo and Amharic tracks" },
    { label: "Draft lessons",        value: "18",  trend: "12 need content review" },
    { label: "Published lessons",    value: "34",  trend: "A1 foundation pack" },
    { label: "Pending reviews",      value: "7",   trend: "Translation and audio QA" },
    { label: "Translation progress", value: "64%", trend: "Across beginner content" },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-black">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Publishing pipeline</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            {["Draft", "Pedagogy review", "Translation QA", "Audio QA", "Published"].map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border bg-background p-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-black text-primary">
                  {i + 1}
                </div>
                <div className="font-extrabold">{step}</div>
                {i < 2 && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Translation progress</CardTitle></CardHeader>
          <CardContent className="grid gap-5">
            <LabeledProgress value={68} label="Afaan Oromo" />
            <LabeledProgress value={61} label="Amharic" />
            <LabeledProgress value={42} label="Audio script alignment" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function LabeledProgress({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-bold">
        <span>{label}</span><span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

/* ── Users tab ───────────────────────────────────────────────── */
function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setUsers(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Registered Users</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${users.length} total users`}
          </p>
        </div>
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm sm:w-72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm font-semibold text-destructive">
          {error}
          <p className="mt-1 font-normal text-muted-foreground">
            Make sure you have run the SQL migration in Supabase to create the profiles table.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          {search ? "No users match your search." : "No users registered yet."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-black">Name</th>
                  <th className="px-4 py-3 text-left font-black">Email</th>
                  <th className="px-4 py-3 text-left font-black">Language</th>
                  <th className="px-4 py-3 text-left font-black">Goal</th>
                  <th className="px-4 py-3 text-right font-black">XP</th>
                  <th className="px-4 py-3 text-right font-black">Streak</th>
                  <th className="px-4 py-3 text-left font-black">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-black text-primary">
                          {u.full_name ? u.full_name.slice(0, 2).toUpperCase() : "??"}
                        </div>
                        {u.full_name || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold capitalize">
                        {u.source_language?.replace("-", " ") ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {u.goal?.replace(/-/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-primary">{u.xp}</td>
                    <td className="px-4 py-3 text-right font-semibold">{u.streak_days}d</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ── Coming soon placeholder ─────────────────────────────────── */
function ComingSoon({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-24 text-center">
      <div className="text-5xl">🚧</div>
      <h2 className="mt-4 text-2xl font-black capitalize">{tab}</h2>
      <p className="mt-2 text-muted-foreground">This section is under construction.</p>
    </div>
  );
}
