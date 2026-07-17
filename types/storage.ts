import { z } from "zod";
import { studyMaterialSchema } from "../lib/validators/studySchema";

// Preference Schema
export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  shufflePreference: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
});

export type PreferencesData = z.infer<typeof preferencesSchema>;

// Flashcard Progress Schema
export const flashcardProgressSchema = z.object({
  currentIndex: z.number().default(0),
  isFlipped: z.boolean().default(false),
  bookmarks: z.record(z.coerce.number(), z.boolean()).default({}),
  difficultyStatus: z.record(z.coerce.number(), z.enum(["easy", "medium", "hard"])).default({}),
  viewedCards: z.array(z.number()).default([0]),
  isShuffled: z.boolean().default(false),
  shuffledOrder: z.array(z.number()).default([]), // originalIndex ordering of current card list
  filterBookmarks: z.boolean().default(false),
});

export type FlashcardProgressData = z.infer<typeof flashcardProgressSchema>;

// Quiz Progress Schema
export const quizProgressSchema = z.object({
  currentIndex: z.number().default(0),
  selectedAnswer: z.number().nullable().default(null),
  isAnswered: z.boolean().default(false),
  mode: z.enum(["quiz", "summary"]).default("quiz"),
  correctCount: z.number().default(0),
  incorrectCount: z.number().default(0),
  wrongQuestionsIndex: z.array(z.number()).default([]), // indices in original quiz list
  activeQuestionsIndex: z.array(z.number()).default([]), // indices in original quiz list
  durationStr: z.string().default("00:00"),
  elapsedTimeOffset: z.number().default(0), // elapsed ms at time of serialization
  startTime: z.number().default(0), // tracks absolute start time
});

export type QuizProgressData = z.infer<typeof quizProgressSchema>;

// Complete Study Session Schema
export const studySessionSchema = z.object({
  version: z.number().default(1),
  createdAt: z.number(), // timestamp
  updatedAt: z.number(), // timestamp
  originalNotes: z.string(),
  material: studyMaterialSchema,
  flashcardProgress: flashcardProgressSchema,
  quizProgress: quizProgressSchema,
});

export type StudySessionData = z.infer<typeof studySessionSchema>;
