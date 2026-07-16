export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyMaterial {
  title: string;
  summary: string;
  keywords: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type StudyGenerateResponse =
  | { success: true; data: StudyMaterial }
  | { success: false; error: string };
