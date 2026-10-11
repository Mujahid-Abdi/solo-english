import { Crown, Loader2, ShieldAlert, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { AgeGroup } from "@/types/course";

interface LeaderRow {
  id: string;
  full_name: string;
  xp: number;
  streak_days: number;
}

export function LeaderboardPage({ ageGroup }: { ageGroup: AgeGroup }) {
  const { user } = useAuth();
  const isChild = ageGroup === "under-15";

  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, xp, streak_days")
      .order("xp", { ascending: false })
      .limit(20)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  const top3 = rows.slice(0, 3);
  const rest  = rows.slice(3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
      <section>
        <h1 className={cn("font-black", isChild ? "text-4xl" : "text-3xl")}>Diamond League</h1>
        <p className="mt-1 text-muted-foreground">
          Top learners ranked by total XP this week.
        </p>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            No learners on the board yet. Be the first!
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
            {/* top 3 podium */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {top3.map((row, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                const isMe = row.id === user?.id;
                return (
                  <div
                    key={row.id}
                    className={cn(
                      "flex flex-col items-center rounded-2xl border p-4 text-center",
                      i === 0 && "border-yellow-400 bg-yellow-50",
                      isMe && "ring-2 ring-primary",
                    )}
                  >
                    <span className="text-3xl">{medals[i]}</span>
                    <div className="mt-2 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-sm font-black text-primary">
                      {row.full_name ? row.full_name.slice(0, 2).toUpperCase() : "??"}
                    </div>
                    <p className="mt-2 max-w-full truncate text-sm font-black">
                      {isMe ? "You" : row.full_name || "Learner"}
                    </p>
                    <p className="text-xs font-bold text-primary">{row.xp.toLocaleString()} XP</p>
                  </div>
                );
              })}
            </div>

            {/* rest of table */}
            {rest.length > 0 && (
              <Card className="mt-4 overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>Full rankings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {rest.map((row, i) => {
                    const rank = i + 4;
                    const isMe = row.id === user?.id;
                    const zone = rank <= 5 ? "promotion" : rank >= rows.length - 1 ? "demotion" : "stable";
                    return (
                      <div
                        key={row.id}
                        className={cn(
                          "grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b px-5 py-4 last:border-0",
                          isMe && "bg-primary/10",
                        )}
                      >
                        <div className="text-lg font-black">#{rank}</div>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "grid h-10 w-10 place-items-center rounded-full bg-muted font-black",
                            isMe && "bg-primary text-primary-foreground",
                          )}>
                            {rank <= 2
                              ? <Crown className="h-5 w-5" />
                              : (row.full_name?.[0] ?? "?")}
                          </div>
                          <div>
                            <p className="font-extrabold">
                              {isMe ? "You" : row.full_name || "Learner"}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground capitalize">{zone} zone</p>
                          </div>
                        </div>
                        <div className="font-black">{row.xp.toLocaleString()} XP</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <TrendingUp className="h-8 w-8 text-primary" aria-hidden />
            <h2 className="mt-3 text-xl font-black">Promotion zone</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Top 5 learners move up to the next league at week's end.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <ShieldAlert className="h-8 w-8 text-secondary" aria-hidden />
            <h2 className="mt-3 text-xl font-black">Demotion zone</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bottom 2 learners drop to the previous league.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
