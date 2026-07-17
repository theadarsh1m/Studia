"use client";

import React from "react";
import { Award, Timer, CheckCircle, XCircle, RotateCcw, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  incorrectCount: number;
  timeTaken: string; // Elapsed time string formatted as mm:ss
  onRestart: () => void;
  onRetestIncorrect: () => void;
  onBackToFlashcards: () => void;
}

export function QuizSummary({
  score,
  totalQuestions,
  incorrectCount,
  timeTaken,
  onRestart,
  onRetestIncorrect,
  onBackToFlashcards,
}: QuizSummaryProps) {
  const accuracy = Math.round((score / totalQuestions) * 100);

  // Motivational message
  let title = "Quiz Completed!";
  let message = "Review your notes and test again to solidify your knowledge.";
  let badgeStyles = "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400";

  if (accuracy === 100) {
    title = "Perfect Score!";
    message = "Spectacular job! You've completely mastered this deck.";
    badgeStyles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 animate-pulse";
  } else if (accuracy >= 80) {
    title = "Amazing Effort!";
    message = "Outstanding work! You have a solid grasp of these concepts.";
    badgeStyles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
  } else if (accuracy >= 50) {
    title = "Good Progress!";
    message = "Nice job! A little more study and you'll get a perfect score.";
    badgeStyles = "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400";
  } else {
    title = "Keep Learning!";
    message = "Don't discourage yourself. Re-study the flashcards and try again!";
    badgeStyles = "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400";
  }

  return (
    <div className="w-full flex flex-col gap-6 items-center text-center p-4">
      {/* Visual Award / Badge */}
      <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center mb-2 ${badgeStyles}`}>
        <Award className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">{message}</p>
      </div>

      {/* Summary Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg mt-4">
        {/* Accuracy */}
        <Card className="border border-border/80 bg-muted/20 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-foreground">{accuracy}%</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">Accuracy</span>
          </CardContent>
        </Card>

        {/* Correct Answers */}
        <Card className="border border-border/80 bg-muted/20 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-2xl font-black text-foreground">{score}</span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">Correct</span>
          </CardContent>
        </Card>

        {/* Incorrect Answers */}
        <Card className="border border-border/80 bg-muted/20 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-black text-foreground">{incorrectCount}</span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">Incorrect</span>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="border border-border/80 bg-muted/20 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-black text-foreground">{timeTaken}</span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">Duration</span>
          </CardContent>
        </Card>
      </div>

      {/* Primary Summary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-6 pt-6 border-t border-border/40">
        {/* Retest Incorrect Button */}
        {incorrectCount > 0 ? (
          <Button
            type="button"
            onClick={onRetestIncorrect}
            className="flex-1 rounded-xl font-semibold text-sm gap-2 h-11 bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            aria-label="Retest incorrect questions"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retest Incorrect</span>
          </Button>
        ) : (
          <div className="flex-1 flex items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            Perfect Score!
          </div>
        )}

        {/* Restart Quiz */}
        <Button
          type="button"
          variant="outline"
          onClick={onRestart}
          className="flex-1 rounded-xl font-semibold text-sm gap-2 h-11 border-border hover:bg-accent/40"
          aria-label="Restart entire quiz"
        >
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
          <span>Restart Quiz</span>
        </Button>
      </div>

      {/* Auxiliary Actions */}
      <Button
        type="button"
        variant="ghost"
        onClick={onBackToFlashcards}
        className="text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-xl gap-1.5 h-10 px-4 mt-2"
        aria-label="Return to Flashcards view"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Flashcards</span>
      </Button>
    </div>
  );
}
