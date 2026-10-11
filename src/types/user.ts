import type { AgeGroup, CEFRLevel, LearningGoal, SourceLanguage } from "@/types/course";

export interface LearnerProfile {
  id: string;
  name: string;
  sourceLanguage: SourceLanguage;
  ageGroup: AgeGroup;
  goal: LearningGoal;
  level: CEFRLevel;
  xp: number;
  streakDays: number;
  longestStreak: number;
  lessonsCompleted: number;
  wordsLearned: number;
  dailyGoalMinutes: number;
  dailyMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export interface Quest {
  id: string;
  title: string;
  progress: number;
  target: number;
  rewardXp: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
  zone?: "promotion" | "stable" | "demotion";
}
