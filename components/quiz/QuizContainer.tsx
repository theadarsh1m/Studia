"use client";

import React, { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { StudyMaterial } from "@/lib/types/study";
import { QuizQuestion } from "./QuizQuestion";
import { QuizProgress } from "./QuizProgress";
import { QuizControls } from "./QuizControls";
import { QuizSummary } from "./QuizSummary";
import { Button } from "@/components/ui/Button";
import { useQuizPersistence } from "@/hooks/useQuizPersistence";
import { QuizProgressData } from "@/types/storage";

interface QuizContainerProps {
  result: StudyMaterial;
  onBackToFlashcards: () => void;
  initialProgress?: QuizProgressData;
  onSaveProgress?: (progress: QuizProgressData) => void;
}

export function QuizContainer({
  result,
  onBackToFlashcards,
  initialProgress,
  onSaveProgress,
}: QuizContainerProps) {
  const defaultProgress: QuizProgressData = {
    currentIndex: 0,
    selectedAnswer: null,
    isAnswered: false,
    mode: "quiz",
    correctCount: 0,
    incorrectCount: 0,
    wrongQuestionsIndex: [],
    activeQuestionsIndex: [],
    durationStr: "00:00",
    elapsedTimeOffset: 0,
    startTime: 0,
  };

  const progressToUse = initialProgress || defaultProgress;
  const noop = () => {};
  const onSaveToUse = onSaveProgress || noop;

  // Delegate state tracking to the custom persistence hook
  const {
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
  } = useQuizPersistence({
    result,
    initialProgress: progressToUse,
    onSave: onSaveToUse,
  });

  // Reset/Initialize quiz state
  const handleRestart = useCallback(() => {
    if (result?.quiz) {
      setActiveQuestions(result.quiz);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      setWrongQuestions([]);
      startTimeRef.current = Date.now();
      setMode("quiz");
    }
  }, [result, setActiveQuestions, setCurrentIndex, setSelectedAnswer, setIsAnswered, setCorrectCount, setIncorrectCount, setWrongQuestions, setMode, startTimeRef]);

  // Handle option selection
  const handleSelectOption = useCallback((optionIndex: number) => {
    if (isAnswered || activeQuestions.length === 0) return;

    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    const question = activeQuestions[currentIndex];
    const isCorrect = optionIndex === question.correctAnswer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setWrongQuestions((prev) => [...prev, question]);
    }
  }, [isAnswered, activeQuestions, currentIndex, setSelectedAnswer, setIsAnswered, setCorrectCount, setIncorrectCount, setWrongQuestions]);

  const handleNext = useCallback(() => {
    if (currentIndex < activeQuestions.length - 1) {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, activeQuestions.length, setSelectedAnswer, setIsAnswered, setCurrentIndex]);

  const handleFinish = useCallback(() => {
    const elapsedMs = Date.now() - startTimeRef.current;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    setDurationStr(`${mins}:${secs}`);
    setMode("summary");
  }, [setDurationStr, setMode, startTimeRef]);

  const handleRetestIncorrect = useCallback(() => {
    if (wrongQuestions.length > 0) {
      setActiveQuestions(wrongQuestions);
      setWrongQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      startTimeRef.current = Date.now();
      setMode("quiz");
    }
  }, [wrongQuestions, setActiveQuestions, setWrongQuestions, setCurrentIndex, setSelectedAnswer, setIsAnswered, setCorrectCount, setIncorrectCount, setMode, startTimeRef]);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (mode === "quiz" && activeQuestions.length > 0) {
        // Options '1', '2', '3', '4'
        if (["1", "2", "3", "4"].includes(e.key) && !isAnswered) {
          e.preventDefault();
          const optionIdx = parseInt(e.key) - 1;
          handleSelectOption(optionIdx);
        }

        // Enter to advance or finish
        if (e.key === "Enter" && isAnswered) {
          e.preventDefault();
          if (currentIndex === activeQuestions.length - 1) {
            handleFinish();
          } else {
            handleNext();
          }
        }
      } else if (mode === "summary") {
        // Restart via 'R' or 'r'
        if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          handleRestart();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, currentIndex, isAnswered, activeQuestions, handleSelectOption, handleNext, handleFinish, handleRestart]);

  // Derive stats
  const totalQuestions = activeQuestions.length;
  const currentQuestionObj = activeQuestions[currentIndex];
  
  const accuracy = correctCount + incorrectCount > 0
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 100;

  const slideVariants = {
    enter: {
      x: 100,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -100,
      opacity: 0,
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 border border-border/80 bg-card/45 backdrop-blur-xs rounded-2xl p-6 md:p-8 shadow-lg select-none">
      
      {/* Quiz Active Mode */}
      {mode === "quiz" && totalQuestions > 0 && currentQuestionObj ? (
        <div className="flex flex-col gap-6">
          {/* Header Progress Indicators */}
          <QuizProgress
            current={currentIndex + 1}
            total={totalQuestions}
            correctAnswers={correctCount}
            wrongAnswers={incorrectCount}
            accuracy={accuracy}
          />

          {/* Render Active Question Card */}
          <div className="min-h-[300px] relative w-full mt-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <QuizQuestion
                  question={currentQuestionObj.question}
                  options={currentQuestionObj.options}
                  correctAnswer={currentQuestionObj.correctAnswer}
                  explanation={currentQuestionObj.explanation}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                  onSelectOption={handleSelectOption}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Answering Controls */}
          <QuizControls
            isLastQuestion={currentIndex === totalQuestions - 1}
            isAnswered={isAnswered}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        </div>
      ) : mode === "quiz" ? (
        /* Fallback for empty list */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4 animate-pulse" />
          <h4 className="text-base font-bold text-foreground">No Quiz Questions Available</h4>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            The study material generated does not contain any valid quiz questions. Try generating another study session with more complete notes.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onBackToFlashcards}
            className="mt-6 rounded-xl text-xs font-semibold hover:bg-accent/40"
          >
            Back to Flashcards
          </Button>
        </div>
      ) : (
        /* Summary Mode Screen */
        <QuizSummary
          score={correctCount}
          totalQuestions={totalQuestions}
          incorrectCount={incorrectCount}
          timeTaken={durationStr}
          onRestart={handleRestart}
          onRetestIncorrect={handleRetestIncorrect}
          onBackToFlashcards={onBackToFlashcards}
        />
      )}
    </div>
  );
}
