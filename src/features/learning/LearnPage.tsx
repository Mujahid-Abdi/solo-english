import type React from "react";
import { ArrowLeft, BookOpen, Check, Flame, Gem, Gift, Heart, Languages, Lock, Shield, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgeGroup, Course, Lesson } from "@/types/course";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const ZIGZAG: number[] = [2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1];

function xPosition(index: number): number {
  return ZIGZAG[index % ZIGZAG.length];
}

type NodeType = "lesson" | "chest" | "checkpoint" | "review";

interface PathNode {
  lesson?: Lesson;
  id: string;
  title: string;
  description: string;
  state: Lesson["state"];
  xp?: number;
  col: number;
  type: NodeType;
}

export function LearnPage({ course, ageGroup }: { course: Course; ageGroup: AgeGroup }) {
  const isChild = ageGroup === "under-15";
  const activeLevel = course.levels.find((l) => l.status === "active") ?? course.levels[0];
  const allLessons = activeLevel?.units.flatMap((u) => u.sections.flatMap((s) => s.lessons)) ?? [];
  const unit = activeLevel?.units[0];

  const nodes = buildPathNodes(allLessons);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 text-slate-50 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0">
        {unit ? (
          <div className="sticky top-[76px] z-20 rounded-lg bg-[#58cc02] p-5 text-white shadow-[0_8px_0_#3f9800] animate-slide-down">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button className="mb-2 inline-flex items-center gap-2 text-sm font-black uppercase text-white/80">
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  Section 1, Unit 1
                </button>
                <h1 className={cn("font-black leading-tight", isChild ? "text-3xl" : "text-2xl")}>{unit.title.replace(" - ", ": ")}</h1>
                <p className="mt-1 max-w-xl text-sm font-bold text-white/85">{unit.description}</p>
              </div>
              <Button variant="outline" className="border-[#3f9800] bg-[#58cc02] text-white shadow-[0_4px_0_#3f9800] hover:bg-[#61dd06]">
                <BookOpen className="h-5 w-5" />
                Guidebook
              </Button>
            </div>
          </div>
        ) : null}

        <div className="relative mx-auto min-h-[820px] max-w-4xl overflow-hidden px-2 py-10 sm:px-6">
          <PathLines nodes={nodes} />
          <div className="pointer-events-none absolute left-[18%] top-28 hidden text-8xl opacity-80 animate-float sm:block" aria-hidden="true">
            🌍
          </div>

          <div className="relative grid grid-cols-5 gap-x-2 gap-y-8 sm:gap-y-10">
            {nodes.map((node, index) => (
              <PathNodeItem key={node.id} node={node} index={index} isChild={isChild} />
            ))}
          </div>
        </div>
      </section>

      <LearnRightRail progress={activeLevel?.progress ?? 0} isChild={isChild} />
    </div>
  );
}

function buildPathNodes(lessons: Lesson[]): PathNode[] {
  const nodes: PathNode[] = lessons.map((lesson, index) => ({
    lesson,
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    state: lesson.state,
    xp: lesson.xp,
    col: xPosition(index),
    type: "lesson",
  }));

  nodes.splice(2, 0, {
    id: "unit-chest-1",
    title: "Reward chest",
    description: "Open after finishing two lessons.",
    state: "completed",
    col: xPosition(2),
    type: "chest",
  });
  nodes.splice(5, 0, {
    id: "unit-review-1",
    title: "Quick review",
    description: "Review words before moving forward.",
    state: "recommended",
    xp: 10,
    col: xPosition(5),
    type: "review",
  });
  nodes.push({
    id: "unit-checkpoint-1",
    title: "Unit checkpoint",
    description: "Complete the unit challenge.",
    state: "locked",
    col: xPosition(nodes.length),
    type: "checkpoint",
  });

  return nodes.map((node, index) => ({ ...node, col: xPosition(index) }));
}

function PathLines({ nodes }: { nodes: PathNode[] }) {
  if (nodes.length < 2) return null;

  const points = nodes
    .map((node, index) => {
      const x = 10 + node.col * 20;
      const y = 8 + index * 92;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="pointer-events-none absolute inset-x-0 top-16 h-[760px] w-full opacity-55" viewBox="0 0 100 760" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke="#294149" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 11" />
    </svg>
  );
}

function PathNodeItem({
  node,
  index,
  isChild,
}: {
  node: PathNode;
  index: number;
  isChild: boolean;
}) {
  const isCompleted = node.state === "completed";
  const isCurrent = node.state === "current";
  const isRecommended = node.state === "recommended";
  const isLocked = node.state === "locked";
  const col = node.col;
  const colStart = col + 1; // CSS grid is 1-indexed

  const nodeStyle = cn(
    "relative flex min-h-28 flex-col items-center justify-start gap-2 select-none",
    "animate-path-pop",
    isLocked && "opacity-50 cursor-not-allowed",
  );

  const ringStyle = cn(
    "relative flex items-center justify-center rounded-full border-b-[8px] transition duration-200 hover:-translate-y-1",
    isChild ? "h-24 w-24" : "h-20 w-20",
    isCompleted && "border-[#3f9800] bg-[#58cc02] text-white shadow-[0_0_0_9px_rgba(88,204,2,0.13)]",
    isCurrent && "border-[#3f9800] bg-[#58cc02] text-white shadow-[0_0_0_12px_rgba(88,204,2,0.18)] animate-active-node",
    isRecommended && "border-[#1687bd] bg-[#1cb0f6] text-white shadow-[0_0_0_9px_rgba(28,176,246,0.14)]",
    isLocked && "border-[#40545c] bg-[#263941] text-[#76909b]",
    node.type === "chest" && "rounded-lg border-[#b77800] bg-[#ffc800] text-[#7a4700] shadow-[0_0_0_8px_rgba(255,200,0,0.12)]",
    node.type === "checkpoint" && "border-[#40545c] bg-[#2d444e]",
  );

  return (
    <div
      className={nodeStyle}
      style={{
        gridColumn: colStart,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {isCurrent && (
        <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border-2 border-[#40545c] bg-[#17262d] px-4 py-2 text-sm font-black uppercase text-[#58cc02] shadow-lg after:absolute after:left-1/2 after:top-full after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-[#40545c] after:bg-[#17262d] animate-start-label">
          START
        </span>
      )}

      <button
        className={ringStyle}
        aria-label={node.title}
        disabled={isLocked}
      >
        {isCurrent && (
          <span className="absolute inset-0 rounded-full bg-[#58cc02] opacity-35 animate-ping" />
        )}

        <NodeIcon state={node.state} type={node.type} />
      </button>

      <span
        className={cn(
          "max-w-[7rem] text-center text-[11px] font-black leading-tight",
          isLocked ? "text-[#667982]" : "text-slate-100",
          isChild && "text-sm",
        )}
      >
        {node.title}
      </span>

      {!isLocked && node.xp ? (
        <span className="rounded-full bg-[#1f343b] px-2 py-0.5 text-[10px] font-black text-[#58cc02]">
          +{node.xp} XP
        </span>
      ) : null}
    </div>
  );
}

function NodeIcon({ state, type }: { state: Lesson["state"]; type: NodeType }) {
  if (type === "chest") return <Gift className="h-9 w-9" strokeWidth={3} aria-hidden="true" />;
  if (type === "checkpoint") return <Trophy className="h-8 w-8" strokeWidth={3} aria-hidden="true" />;
  if (type === "review") return <Zap className="h-8 w-8" strokeWidth={3} aria-hidden="true" />;

  switch (state) {
    case "completed":
      return <Check className="h-9 w-9" strokeWidth={4} aria-hidden="true" />;
    case "current":
      return <Star className="h-9 w-9 fill-white" strokeWidth={3} aria-hidden="true" />;
    case "recommended":
      return <BookOpen className="h-8 w-8" strokeWidth={3} aria-hidden="true" />;
    case "locked":
      return <Lock className="h-7 w-7" strokeWidth={3} aria-hidden="true" />;
  }
}

function LearnRightRail({ progress, isChild }: { progress: number; isChild: boolean }) {
  return (
    <aside className="space-y-5 xl:sticky xl:top-[92px] xl:self-start">
      <div className="grid grid-cols-4 gap-3 rounded-lg border-2 border-[#31464f] bg-[#122126] p-4">
        <RailStat icon={<Languages className="h-6 w-6 text-[#ff5b66]" />} value="4" label="language days" />
        <RailStat icon={<FlameIcon />} value="74" label="energy" muted />
        <RailStat icon={<Gem className="h-6 w-6 text-[#1cb0f6]" />} value="2462" label="gems" />
        <RailStat icon={<Heart className="h-6 w-6 fill-[#ff5b66] text-[#ff5b66]" />} value="5" label="hearts" danger />
      </div>

      <div className="rounded-lg border-2 border-[#31464f] bg-[#122126] p-5 animate-fade-in-up">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-black">English A1 progress</h2>
          <span className="font-black text-[#58cc02]">{progress}%</span>
        </div>
        <Progress value={progress} className="[&_div:first-child]:bg-[#263941] [&_div>div]:bg-[#58cc02]" />
      </div>

      <div className="rounded-lg border-2 border-[#31464f] bg-[#122126] p-6 animate-fade-in-up [animation-delay:80ms]">
        <div className="inline-flex rounded-md bg-gradient-to-r from-[#1cb0f6] to-[#ce82ff] px-3 py-1 text-sm font-black italic text-white">
          SOLO PLUS
        </div>
        <div className="mt-5 flex items-start gap-4">
          <div>
            <h2 className="text-2xl font-black">Try premium for free</h2>
            <p className="mt-3 text-base font-bold leading-7 text-slate-300">No ads, personalized practice, offline packs, and certificate tools.</p>
          </div>
          <div className="hidden h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-[#58cc02] via-[#1cb0f6] to-[#ce82ff] p-3 animate-float sm:block">
            <Sparkles className="h-full w-full text-white" />
          </div>
        </div>
        <Button className="mt-6 w-full bg-[#4855ff] text-white shadow-[0_5px_0_#2d36bd] hover:bg-[#5662ff]">Try 1 week free</Button>
      </div>

      <div className="rounded-lg border-2 border-[#31464f] bg-[#122126] p-6 animate-fade-in-up [animation-delay:160ms]">
        <p className="text-sm font-black uppercase text-[#667982]">Leaderboards</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black">Good job!</h2>
            <p className="mt-3 text-base font-bold leading-7 text-slate-300">You kept your position in the Diamond League.</p>
          </div>
          <Shield className="h-20 w-20 shrink-0 text-cyan-200 animate-float" aria-hidden="true" />
        </div>
        <Button variant="outline" className="mt-6 w-full border-[#31464f] bg-transparent text-[#1cb0f6] hover:bg-[#1d333b]">Go to leaderboards</Button>
      </div>

      <div className="rounded-lg border-2 border-[#31464f] bg-[#122126] p-6 animate-fade-in-up [animation-delay:260ms]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Daily Quests</h2>
          <button className="text-sm font-black uppercase text-[#1cb0f6]">View all</button>
        </div>
        <div className="mt-5 space-y-4">
          <QuestLine label="Complete 2 lessons" value={50} />
          <QuestLine label={isChild ? "Win a reward star" : "Earn 30 XP"} value={73} />
          <QuestLine label="Do one listening task" value={10} />
        </div>
      </div>
    </aside>
  );
}

function RailStat({ icon, value, label, muted, danger }: { icon: React.ReactNode; value: string; label: string; muted?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`${value} ${label}`}>
      {icon}
      <span className={cn("text-lg font-black", muted && "text-[#40545c]", danger && "text-[#ff5b66]")}>{value}</span>
    </div>
  );
}

function QuestLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
        <span>{label}</span>
        <span className="text-[#58cc02]">{value}%</span>
      </div>
      <Progress value={value} className="[&_div:first-child]:bg-[#263941] [&_div>div]:bg-[#58cc02]" />
    </div>
  );
}

function FlameIcon() {
  return (
    <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[#263941] text-[#526972]" aria-hidden="true">
      <Flame className="h-4 w-4" />
    </span>
  );
}
