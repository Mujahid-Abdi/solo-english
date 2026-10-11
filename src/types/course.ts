export type SourceLanguage = "afaan-oromo" | "amharic";
export type AgeGroup = "under-15" | "15-plus";
export type LearningGoal =
  | "speak-confidently"
  | "school-english"
  | "university"
  | "workplace"
  | "general";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type LessonState = "completed" | "current" | "recommended" | "locked";

export interface Exercise {
  id: string;
  title: string;
  skill: "vocabulary" | "grammar" | "listening" | "speaking" | "reading" | "writing";
  estimatedMinutes: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  state: LessonState;
  xp: number;
  exercises: Exercise[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

export interface CourseLevel {
  id: string;
  cefr: CEFRLevel;
  title: string;
  progress: number;
  status: "active" | "available" | "locked";
  units: Unit[];
}

export interface Course {
  id: string;
  title: string;
  sourceLanguage: SourceLanguage;
  targetLanguage: "english";
  levels: CourseLevel[];
}
