"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Percent } from "lucide-react";

interface QuizProgressProps {
  current: number; // 1-indexed
  total: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
}

export function QuizProgress({
  current,
  total,
  correctAnswers,
  wrongAnswers,
  accuracy,
}: QuizProgressProps) {
  const percentage = Math.round(((current - 1) / total) * 100);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top row: progress counts and metrics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <span className="text-foreground">
          Question {current} of {total}
        </span>

        {/* Real-time stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{correctAnswers} Correct</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <XCircle className="w-3.5 h-3.5" />
            <span>{wrongAnswers} Incorrect</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <Percent className="w-3.5 h-3.5" />
            <span>{accuracy}% Accuracy</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-border/40 overflow-hidden relative">
        <motion.div
          className="h-full bg-zinc-950 dark:bg-zinc-100 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
