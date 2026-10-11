import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Languages, School, Sparkles, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import type { OnboardingState } from "@/App";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgeGroup, LearningGoal, SourceLanguage } from "@/types/course";

const languageOptions: { id: SourceLanguage; label: string; native: string }[] = [
  { id: "afaan-oromo", label: "Afaan Oromo", native: "Afaan Oromo irraa Ingiliffa" },
  { id: "amharic", label: "Amharic", native: "ከአማርኛ ወደ እንግሊዝኛ" },
];

const goals: { id: LearningGoal; label: string; icon: typeof Sparkles }[] = [
  { id: "speak-confidently", label: "Speak English confidently", icon: Sparkles },
  { id: "school-english", label: "Improve school English", icon: School },
  { id: "university", label: "Prepare for university", icon: GraduationCap },
  { id: "workplace", label: "Improve workplace English", icon: Briefcase },
  { id: "general", label: "General English", icon: UserRoundCheck },
];

export function OnboardingFlow({
  value,
  onChange,
  onBack,
  onComplete,
}: {
  value: OnboardingState;
  onChange: (value: OnboardingState) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
        <Logo />
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Home
        </Button>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex gap-2" aria-label={`Onboarding step ${step} of 3`}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={cn("h-2 flex-1 rounded-full bg-muted", item <= step && "bg-primary")} />
          ))}
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            {step === 1 ? (
              <section>
                <Languages className="h-10 w-10 text-primary" aria-hidden="true" />
                <h1 className="mt-4 text-3xl font-black">What language would you like to learn English through?</h1>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {languageOptions.map((option) => (
                    <Choice
                      key={option.id}
                      selected={value.sourceLanguage === option.id}
                      title={option.label}
                      description={option.native}
                      onClick={() => onChange({ ...value, sourceLanguage: option.id })}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section>
                <h1 className="text-3xl font-black">Choose the learner age group.</h1>
                <p className="mt-2 text-muted-foreground">This changes visual density, safety defaults, and touch target size.</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Choice
                    selected={value.ageGroup === "under-15"}
                    title="Under 15"
                    description="A simpler, colorful, child-safe learning journey."
                    onClick={() => onChange({ ...value, ageGroup: "under-15" as AgeGroup })}
                  />
                  <Choice
                    selected={value.ageGroup === "15-plus"}
                    title="15+"
                    description="A focused, mature experience for school, university, work, and life."
                    onClick={() => onChange({ ...value, ageGroup: "15-plus" as AgeGroup })}
                  />
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h1 className="text-3xl font-black">What is your main learning goal?</h1>
                <div className="mt-7 grid gap-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      className={cn(
                        "flex min-h-16 items-center gap-4 rounded-lg border-2 bg-card p-4 text-left transition hover:border-primary",
                        value.goal === goal.id && "border-primary bg-primary/5",
                      )}
                      onClick={() => onChange({ ...value, goal: goal.id })}
                    >
                      <goal.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <span className="font-extrabold">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 flex justify-between gap-3">
              <Button variant="outline" onClick={() => (step === 1 ? onBack() : setStep(step - 1))}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={() => (step === 3 ? onComplete() : setStep(step + 1))}>
                {step === 3 ? "Continue" : "Next"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Choice({ selected, title, description, onClick }: { selected: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button
      className={cn(
        "min-h-36 rounded-lg border-2 bg-card p-5 text-left transition hover:border-primary",
        selected && "border-primary bg-primary/5",
      )}
      onClick={onClick}
    >
      <div className="text-xl font-black">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </button>
  );
}
