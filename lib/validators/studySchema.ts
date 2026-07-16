import { z } from "zod";

export const flashcardSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  answer: z.string().min(1, "Answer cannot be empty"),
});

export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  options: z.array(z.string().min(1, "Option cannot be empty")).length(4, "Quiz must have exactly 4 options"),
  correctAnswer: z.number().int().min(0).max(3, "Correct answer must be a valid option index (0-3)"),
  explanation: z.string().min(1, "Explanation cannot be empty"),
});

export const studyMaterialSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  summary: z.string().min(1, "Summary cannot be empty"),
  keywords: z.array(z.string()),
  flashcards: z.union([
    z.array(flashcardSchema).min(5).max(10),
    z.array(flashcardSchema).length(0)
  ]),
  quiz: z.union([
    z.array(quizQuestionSchema).length(5),
    z.array(quizQuestionSchema).length(0)
  ]),
});
