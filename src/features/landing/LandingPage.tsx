import { ArrowRight, BookOpen, CheckCircle2, CloudDownload, Languages, Mic, ShieldCheck, Volume2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const features = [
  { icon: BookOpen, title: "Step-by-step English", text: "A1 to C2 paths for vocabulary, grammar, reading, and writing." },
  { icon: Volume2, title: "Listening practice", text: "Future audio lessons prepared for Ethiopian language support." },
  { icon: Mic, title: "Speaking foundation", text: "Pronunciation practice screens ready for later scoring." },
  { icon: CloudDownload, title: "Offline learning ready", text: "Designed for downloadable lessons in later phases." },
  { icon: Languages, title: "Afaan Oromo and Amharic", text: "Learn English through languages Ethiopian learners already use." },
  { icon: ShieldCheck, title: "Age-aware experience", text: "Separate adult and under-15 shells with safer interaction patterns." },
];

export function LandingPage({ onStart, onExplore, onAdmin }: { onStart: () => void; onExplore: () => void; onAdmin: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onAdmin}>Admin</Button>
          <Button onClick={onStart}>Start Learning</Button>
        </div>
      </header>

      <main>
        <section className="surface-grid border-y">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
            <div>
              <div className="mb-4 inline-flex rounded-full border bg-card px-3 py-1 text-sm font-bold text-primary">
                Afaan Oromo to English | Amharic to English
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
                Learn English with a path built for Ethiopian learners.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Solo English helps learners build confidence through structured levels, short practice, gamified goals, and language support that starts from Afaan Oromo and Amharic.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={onStart}>
                  Start Learning <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={onExplore}>Explore</Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="rounded-lg bg-slate-950 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Today</p>
                      <h2 className="text-2xl font-black">English A1</h2>
                    </div>
                    <div className="rounded-md bg-secondary px-3 py-2 font-black text-slate-950">7 days</div>
                  </div>
                  <div className="mt-6 rounded-lg bg-white p-4 text-slate-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-muted-foreground">Continue</p>
                        <h3 className="text-xl font-black">Greetings - Lesson 3</h3>
                      </div>
                      <CheckCircle2 className="h-9 w-9 text-primary" />
                    </div>
                    <Progress value={35} className="mt-4" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    {["1,240 XP", "8/10 min", "3 quests"].map((item) => (
                      <div key={item} className="rounded-md bg-white/10 p-3 text-sm font-black">{item}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="explore" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black">Everything learners need, organized simply.</h2>
            <p className="mt-3 text-muted-foreground">This first foundation shows the product system, navigation, and future learning structure without building the advanced engines yet.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-5">
                  <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <h2 className="text-3xl font-black">Learning path preview</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-6">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level, index) => (
                <div key={level} className="rounded-lg border bg-background p-5 text-center">
                  <div className={index === 0 ? "text-3xl font-black text-primary" : "text-3xl font-black text-muted-foreground"}>{level}</div>
                  <div className="mt-2 text-xs font-bold uppercase text-muted-foreground">{index === 0 ? "Active" : "Future"}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-black">Begin with a few choices. Continue with a clear path.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Choose Afaan Oromo or Amharic, pick the right age experience, and preview your English journey.</p>
          <Button className="mt-7" size="lg" onClick={onStart}>Start Learning</Button>
        </section>
      </main>
    </div>
  );
}
