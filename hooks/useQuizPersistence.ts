import { useState, useEffect, useRef } from "react";
import { StudyMaterial, QuizQuestion as QuizQuestionType } from "../lib/types/study";
import { QuizProgressData } from "../types/storage";

interface UseQuizPersistenceProps {
  result: StudyMaterial;
  initialProgress: QuizProgressData;
  onSave: (progress: QuizProgressData) => void;
}

export function useQuizPersistence({
  result,
  initialProgress,
  onSave,
}: UseQuizPersistenceProps) {
  // Initialize activeQuestions list using a pure state initializer function
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionType[]>(() => {
    if (initialProgress.activeQuestionsIndex && initialProgress.activeQuestionsIndex.length > 0 && result?.quiz) {
      return initialProgress.activeQuestionsIndex
        .map((idx) => result.quiz[idx])
        .filter(Boolean);
    }
    return result?.quiz || [];
  });

  // Initialize wrongQuestions list using a pure state initializer function
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestionType[]>(() => {
    if (initialProgress.wrongQuestionsIndex && initialProgress.wrongQuestionsIndex.length > 0 && result?.quiz) {
      return initialProgress.wrongQuestionsIndex
        .map((idx) => result.quiz[idx])
        .filter(Boolean);
    }
    return [];
  });

  // Initialize other progress states directly from initialProgress props
  const [currentIndex, setCurrentIndex] = useState(initialProgress.currentIndex);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(initialProgress.selectedAnswer);
  const [isAnswered, setIsAnswered] = useState(initialProgress.isAnswered);
  const [mode, setMode] = useState<"quiz" | "summary">(initialProgress.mode);
  const [correctCount, setCorrectCount] = useState(initialProgress.correctCount);
  const [incorrectCount, setIncorrectCount] = useState(initialProgress.incorrectCount);
  const [durationStr, setDurationStr] = useState(initialProgress.durationStr);

  const startTimeRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Initialize start time and load state on mount (safely outside render)
  useEffect(() => {
    startTimeRef.current = Date.now() - initialProgress.elapsedTimeOffset;
    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run exactly once on mount to establish clock markers

  // Sync state if new quiz is generated
  useEffect(() => {
    if (result?.quiz) {
      setTimeout(() => {
        setActiveQuestions(result.quiz);
      }, 0);
    }
  }, [result]);

  // Trigger onSave callback whenever quiz states change (Autosave)
  useEffect(() => {
    if (!isInitializedRef.current || activeQuestions.length === 0 || !result?.quiz) return;

    // Calculate active questions indices mapping in the original quiz list
    const activeQuestionsIndex = activeQuestions.map((q) => 
      result.quiz.findIndex((origQ) => origQ.question === q.question)
    ).filter((idx) => idx !== -1);

    // Calculate wrong questions indices mapping in the original quiz list
    const wrongQuestionsIndex = wrongQuestions.map((q) =>
      result.quiz.findIndex((origQ) => origQ.question === q.question)
    ).filter((idx) => idx !== -1);

    // Track elapsed time offset for mid-quiz refreshes
    const elapsedTimeOffset = Date.now() - startTimeRef.current;

    const progress: QuizProgressData = {
      currentIndex,
      selectedAnswer,
      isAnswered,
      mode,
      correctCount,
      incorrectCount,
      wrongQuestionsIndex,
      activeQuestionsIndex,
      durationStr,
      elapsedTimeOffset,
      startTime: startTimeRef.current,
    };
    onSave(progress);
  }, [
    currentIndex,
    selectedAnswer,
    isAnswered,
    mode,
    correctCount,
    incorrectCount,
    wrongQuestions,
    activeQuestions,
    durationStr,
    onSave,
    result,
  ]);

  return {
    activeQuestions,
    setActiveQuestions,
    currentIndex,
    setCurrentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswered,
    setIsAnswered,
    mode,
    setMode,
    correctCount,
    setCorrectCount,
    incorrectCount,
    setIncorrectCount,
    wrongQuestions,
    setWrongQuestions,
    durationStr,
    setDurationStr,
    startTimeRef,
  };
}
