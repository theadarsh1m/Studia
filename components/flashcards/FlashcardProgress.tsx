"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlashcardProgressProps {
  current: number; // 1-indexed
  total: number;
}

export function FlashcardProgress({ current, total }: FlashcardProgressProps) {
  // Guard for divide by zero or empty list
  const totalSafe = total > 0 ? total : 1;
  const percentage = Math.round((current / totalSafe) * 100);

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-6 flex flex-col gap-2.5">
      {/* Label indicating position and percentage */}
      <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <span>
          Card {total > 0 ? current : 0} of {total}
        </span>
        <span>{percentage}% Complete</span>
      </div>

      {/* Progress bar container */}
      <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800/50 overflow-hidden relative border border-border/10">
        <motion.div
          className="h-full bg-zinc-950 dark:bg-zinc-100 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
