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
  flashcards: z.array(flashcardSchema).max(50, "Maximum 50 flashcards allowed"),
  quiz: z.array(quizQuestionSchema).max(30, "Maximum 30 quiz questions allowed"),
});

export const refinementResponseSchema = z.object({
  updatedSection: z.enum(["summary", "flashcards", "quiz"]),
  content: z.any(),
});

export function validateRefinementContent(updatedSection: "summary" | "flashcards" | "quiz", content: unknown) {
  if (updatedSection === "summary") {
    return z.string().min(1, "Summary cannot be empty").parse(content);
  }
  if (updatedSection === "flashcards") {
    return z.array(flashcardSchema).max(50).parse(content);
  }
  if (updatedSection === "quiz") {
    return z.array(quizQuestionSchema).max(30).parse(content);
  }
  throw new Error("Invalid updatedSection value");
}
