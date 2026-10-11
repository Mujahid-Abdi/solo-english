import { supabase } from "@/lib/supabase";
import type { AgeGroup, LearningGoal, SourceLanguage } from "@/types/course";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  source_language: SourceLanguage;
  age_group: AgeGroup;
  goal: LearningGoal;
  xp: number;
  streak_days: number;
  longest_streak: number;
  lessons_completed: number;
  words_learned: number;
  daily_goal_minutes: number;
  created_at: string;
}

/** Fetch a profile by user id */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
  return data ?? null;
}

/** Create or update a profile (upsert) */
export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update avatar url */
export async function updateAvatar(userId: string, avatarUrl: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);
  if (error) throw error;
}
