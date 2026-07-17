"use client";

import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuizControlsProps {
  isLastQuestion: boolean;
  isAnswered: boolean;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizControls({
  isLastQuestion,
  isAnswered,
  onNext,
  onFinish,
}: QuizControlsProps) {
  if (!isAnswered) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-6 flex items-center justify-end">
      {isLastQuestion ? (
        <Button
          type="button"
          onClick={onFinish}
          className="w-full sm:w-auto font-semibold text-sm gap-2 h-11 px-6 bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl shadow-xs"
          aria-label="Finish quiz and show results"
        >
          <span>Finish Quiz</span>
          <CheckCircle className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto font-semibold text-sm gap-2 h-11 px-6 bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl shadow-xs"
          aria-label="Go to next question"
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
