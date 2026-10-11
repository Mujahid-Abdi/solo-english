import { BookText, Brain, Headphones, Mic, PenLine, RotateCcw, SpellCheck, TextSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgeGroup } from "@/types/course";

const practices = [
  { title: "Vocabulary", description: "Learn and review words.", icon: SpellCheck },
  { title: "Grammar", description: "Practice grammar.", icon: Brain },
  { title: "Listening", description: "Train listening comprehension.", icon: Headphones },
  { title: "Speaking", description: "Practice pronunciation.", icon: Mic },
  { title: "Reading", description: "Improve reading comprehension.", icon: BookText },
  { title: "Writing", description: "Practice written English.", icon: PenLine },
  { title: "Mistakes Review", description: "Review previous mistakes.", icon: RotateCcw },
  { title: "Mixed Practice", description: "Short review across skills.", icon: TextSelect },
];

export function PracticePage({ ageGroup }: { ageGroup: AgeGroup }) {
  const isChild = ageGroup === "under-15";
  return (
    <div>
      <h1 className={cn("font-black", isChild ? "text-4xl" : "text-3xl")}>Practice</h1>
      <p className="mt-2 text-muted-foreground">Skill categories are placeholders for the future exercise engine.</p>
      <div className={cn("mt-6 grid gap-4", isChild ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {practices.map((practice) => (
          <Card key={practice.title} className="transition hover:-translate-y-0.5 hover:border-primary">
            <CardContent className={cn("p-5", isChild && "p-6")}>
              <practice.icon className="h-9 w-9 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black">{practice.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{practice.description}</p>
              <Button className="mt-5 w-full" variant={practice.title === "Mistakes Review" ? "secondary" : "default"}>Start</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
