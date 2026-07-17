"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  text: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export function QuizOption({
  text,
  index,
  isSelected,
  isCorrect,
  isIncorrect,
  isDisabled,
  onSelect,
}: QuizOptionProps) {
  // Styles based on state
  let cardStyles = "border-border/60 bg-muted/30 text-foreground hover:bg-muted/50 hover:border-border/80";
  let checkIcon = null;

  if (isSelected) {
    cardStyles = "border-zinc-950 bg-zinc-950/5 dark:border-zinc-100 dark:bg-zinc-100/5 ring-1 ring-zinc-950 dark:ring-zinc-100";
  }

  if (isCorrect) {
    cardStyles = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500";
    checkIcon = <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />;
  } else if (isIncorrect) {
    cardStyles = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-500";
    checkIcon = <X className="w-4.5 h-4.5 text-red-500 shrink-0" />;
  }

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      onClick={onSelect}
      whileHover={!isDisabled ? { scale: 1.01, translateY: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      transition={{ duration: 0.2 }}
      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed ${cardStyles}`}
      aria-label={`Option ${index + 1}: ${text}`}
    >
      <div className="flex items-center gap-3">
        {/* Hotkey circle */}
        <span className={`w-6 h-6 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 border transition-colors ${
          isCorrect 
            ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            : isIncorrect
            ? "border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400"
            : isSelected
            ? "border-zinc-950/30 bg-zinc-950/20 text-zinc-950 dark:border-zinc-100/30 dark:bg-zinc-100/20 dark:text-zinc-100"
            : "border-border/60 bg-muted/60 text-muted-foreground"
        }`}>
          {index + 1}
        </span>
        <span className="text-sm font-medium leading-normal">{text}</span>
      </div>
      {checkIcon}
    </motion.button>
  );
}
