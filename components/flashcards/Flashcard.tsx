"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  difficulty: "easy" | "medium" | "hard" | undefined;
  onRateDifficulty: (rating: "easy" | "medium" | "hard") => void;
}

export function Flashcard({
  question,
  answer,
  isFlipped,
  onFlip,
  isBookmarked,
  onToggleBookmark,
  difficulty,
  onRateDifficulty,
}: FlashcardProps) {
  // Animating the rotation of the card
  return (
    <div className="w-full max-w-xl mx-auto h-[350px] [perspective:1000px] group relative">
      {/* Bookmark Ribbon Button - accessible outside the 3D rotating card context to avoid click issues */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark();
        }}
        className={`absolute top-4 right-6 z-30 p-2.5 rounded-full border transition-all duration-300 ${
          isBookmarked
            ? "bg-zinc-950 border-zinc-900 text-amber-500 shadow-md dark:bg-zinc-100 dark:border-zinc-200"
            : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40"
        }`}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
        title={isBookmarked ? "Remove bookmark" : "Bookmark card"}
      >
        <Bookmark className="w-5 h-5 fill-current" />
      </button>

      {/* Main Flipping Card Body */}
      <motion.div
        className="w-full h-full relative cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={onFlip}
        aria-label="Flashcard. Press space or click to flip."
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onFlip();
          }
        }}
      >
        {/* Front Side: Question */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl border border-border bg-card shadow-md flex flex-col p-8 justify-between [backface-visibility:hidden] select-none"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Question
            </span>
            {difficulty && (
              <Badge
                variant={
                  difficulty === "easy"
                    ? "secondary"
                    : difficulty === "medium"
                    ? "default"
                    : "destructive"
                }
                className="capitalize text-xs font-medium tracking-wide"
              >
                {difficulty}
              </Badge>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center py-6 text-center">
            <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-foreground max-w-sm">
              {question}
            </p>
          </div>

          <div className="text-center text-xs text-muted-foreground/80 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 animate-pulse" />
            <span>Click card or press Space to reveal answer</span>
          </div>
        </div>

        {/* Back Side: Answer */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl border border-border bg-card shadow-md flex flex-col p-8 justify-between [backface-visibility:hidden] select-none"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Answer
            </span>
            <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/5 font-semibold">
              Correct Answer
            </Badge>
          </div>

          <div className="flex-1 flex items-center justify-center py-6 text-center overflow-y-auto">
            <p className="text-lg sm:text-xl leading-relaxed text-foreground max-w-sm font-medium">
              {answer}
            </p>
          </div>

          {/* Difficulty rating controls */}
          <div
            className="flex flex-col gap-3 mt-auto pt-4 border-t border-border/40"
            onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking difficulty controls
          >
            <p className="text-center text-xs font-medium text-muted-foreground">
              How did you do? Rate difficulty:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={difficulty === "easy" ? "secondary" : "outline"}
                size="sm"
                className={`font-semibold capitalize text-xs rounded-lg ${
                  difficulty === "easy"
                    ? "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "hover:bg-emerald-500/5 hover:border-emerald-500/30 hover:text-emerald-500"
                }`}
                onClick={() => onRateDifficulty("easy")}
                aria-label="Mark card as Easy"
              >
                Easy
              </Button>
              <Button
                type="button"
                variant={difficulty === "medium" ? "default" : "outline"}
                size="sm"
                className={`font-semibold capitalize text-xs rounded-lg ${
                  difficulty === "medium"
                    ? "bg-zinc-950 hover:bg-zinc-900 border-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950"
                    : "hover:bg-accent/40 hover:text-foreground"
                }`}
                onClick={() => onRateDifficulty("medium")}
                aria-label="Mark card as Medium"
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={difficulty === "hard" ? "destructive" : "outline"}
                size="sm"
                className={`font-semibold capitalize text-xs rounded-lg ${
                  difficulty === "hard"
                    ? "bg-destructive/10 hover:bg-destructive/15 border-destructive/30 text-destructive"
                    : "hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive"
                }`}
                onClick={() => onRateDifficulty("hard")}
                aria-label="Mark card as Hard"
              >
                Hard
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
