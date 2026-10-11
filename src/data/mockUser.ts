import type { Achievement, LeaderboardEntry, LearnerProfile, Quest } from "@/types/user";

export const learner: LearnerProfile = {
  id: "learner-1",
  name: "Sara Bekele",
  sourceLanguage: "afaan-oromo",
  ageGroup: "15-plus",
  goal: "workplace",
  level: "A1",
  xp: 1240,
  streakDays: 7,
  longestStreak: 18,
  lessonsCompleted: 42,
  wordsLearned: 318,
  dailyGoalMinutes: 10,
  dailyMinutes: 8,
};

export const quests: Quest[] = [
  { id: "q1", title: "Complete 2 lessons", progress: 1, target: 2, rewardXp: 20 },
  { id: "q2", title: "Earn 30 XP", progress: 22, target: 30, rewardXp: 10 },
  { id: "q3", title: "Complete one listening exercise", progress: 0, target: 1, rewardXp: 15 },
];

export const achievements: Achievement[] = [
  { id: "a1", title: "First Steps", description: "Completed your first lesson.", earned: true },
  { id: "a2", title: "Week Strong", description: "Kept a 7-day streak.", earned: true },
  { id: "a3", title: "Word Builder", description: "Learn 500 words.", earned: false },
  { id: "a4", title: "A1 Certificate", description: "Complete all A1 units.", earned: false },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: "u1", rank: 1, name: "Mekdes", xp: 2870, zone: "promotion" },
  { id: "u2", rank: 2, name: "Abdi", xp: 2620, zone: "promotion" },
  { id: "u3", rank: 3, name: "Sara Bekele", xp: 1240, isCurrentUser: true, zone: "stable" },
  { id: "u4", rank: 4, name: "Yonas", xp: 1180, zone: "stable" },
  { id: "u5", rank: 5, name: "Hana", xp: 910, zone: "demotion" },
];
