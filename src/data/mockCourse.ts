import type { Course, Lesson } from "@/types/course";

const a1Lessons: Lesson[] = [
  {
    id: "greetings",
    title: "Greetings",
    description: "Say hello, goodbye, and ask how someone is.",
    state: "completed",
    xp: 15,
    exercises: [
      { id: "greetings-vocab", title: "Common greetings", skill: "vocabulary", estimatedMinutes: 4 },
      { id: "greetings-speak", title: "Repeat greetings", skill: "speaking", estimatedMinutes: 3 },
    ],
  },
  {
    id: "introductions",
    title: "Introductions",
    description: "Share your name, where you are from, and basic details.",
    state: "completed",
    xp: 20,
    exercises: [{ id: "intro-writing", title: "Write a simple introduction", skill: "writing", estimatedMinutes: 5 }],
  },
  {
    id: "numbers",
    title: "Numbers",
    description: "Practice numbers for age, time, price, and phone numbers.",
    state: "current",
    xp: 20,
    exercises: [{ id: "numbers-listening", title: "Hear and choose numbers", skill: "listening", estimatedMinutes: 6 }],
  },
  {
    id: "family",
    title: "Family",
    description: "Talk about people in your family and community.",
    state: "recommended",
    xp: 20,
    exercises: [{ id: "family-reading", title: "Read a family story", skill: "reading", estimatedMinutes: 7 }],
  },
  {
    id: "everyday-english",
    title: "Everyday English",
    description: "Use simple English for daily places and routines.",
    state: "locked",
    xp: 25,
    exercises: [{ id: "everyday-grammar", title: "Simple present practice", skill: "grammar", estimatedMinutes: 8 }],
  },
  {
    id: "classroom-phrases",
    title: "Classroom Phrases",
    description: "Ask for help and understand teacher instructions.",
    state: "locked",
    xp: 25,
    exercises: [{ id: "classroom-listening", title: "Classroom listening", skill: "listening", estimatedMinutes: 6 }],
  },
  {
    id: "food-drinks",
    title: "Food and Drinks",
    description: "Talk about meals, drinks, and simple preferences.",
    state: "locked",
    xp: 25,
    exercises: [{ id: "food-vocab", title: "Food words", skill: "vocabulary", estimatedMinutes: 5 }],
  },
  {
    id: "places-town",
    title: "Places in Town",
    description: "Name common places and ask where they are.",
    state: "locked",
    xp: 30,
    exercises: [{ id: "places-speaking", title: "Ask for directions", skill: "speaking", estimatedMinutes: 7 }],
  },
  {
    id: "daily-routines",
    title: "Daily Routines",
    description: "Describe what you do every day.",
    state: "locked",
    xp: 30,
    exercises: [{ id: "routines-writing", title: "Write your routine", skill: "writing", estimatedMinutes: 8 }],
  },
];

export const courses: Course[] = [
  {
    id: "or-en",
    title: "Afaan Oromo to English",
    sourceLanguage: "afaan-oromo",
    targetLanguage: "english",
    levels: [
      {
        id: "or-en-a1",
        cefr: "A1",
        title: "Beginner English",
        progress: 35,
        status: "active",
        units: [
          {
            id: "a1-foundations",
            title: "Unit 1 - Foundations",
            description: "Start speaking simple English for real daily situations.",
            sections: [{ id: "a1-foundations-core", title: "Core Skills", lessons: [...a1Lessons] }],
          },
        ],
      },
      { id: "or-en-a2", cefr: "A2", title: "Elementary English", progress: 0, status: "available", units: [] },
      { id: "or-en-b1", cefr: "B1", title: "Intermediate English", progress: 0, status: "locked", units: [] },
      { id: "or-en-b2", cefr: "B2", title: "Upper Intermediate", progress: 0, status: "locked", units: [] },
      { id: "or-en-c1", cefr: "C1", title: "Advanced English", progress: 0, status: "locked", units: [] },
      { id: "or-en-c2", cefr: "C2", title: "Proficient English", progress: 0, status: "locked", units: [] },
    ],
  },
  {
    id: "am-en",
    title: "Amharic to English",
    sourceLanguage: "amharic",
    targetLanguage: "english",
    levels: [],
  },
];
