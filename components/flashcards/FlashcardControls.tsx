"use client";

import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FlashcardControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  onShuffle: () => void;
  onRestart: () => void;
  isFirst: boolean;
  isLast: boolean;
  isShuffled: boolean;
  hasCards: boolean;
}

export function FlashcardControls({
  onPrevious,
  onNext,
  onFlip,
  onShuffle,
  onRestart,
  isFirst,
  isLast,
  isShuffled,
  hasCards,
}: FlashcardControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8 max-w-xl mx-auto w-full px-4">
      {/* Shuffle Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!hasCards}
        onClick={onShuffle}
        className={`h-10 w-10 rounded-xl transition-all duration-300 border ${
          isShuffled
            ? "bg-zinc-950 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-950 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border-transparent"
        }`}
        title={isShuffled ? "Restore original order" : "Shuffle cards"}
        aria-label={isShuffled ? "Restore original order" : "Shuffle cards"}
      >
        <Shuffle className="w-4.5 h-4.5" />
      </Button>

      {/* Navigation and Flip Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isFirst || !hasCards}
          onClick={onPrevious}
          className="h-11 w-11 rounded-xl text-foreground border-border hover:bg-accent/40 disabled:opacity-40 shadow-xs"
          title="Previous card (←)"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Flip Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onFlip}
          disabled={!hasCards}
          className="h-11 px-5 rounded-xl font-semibold text-sm border-border hover:bg-accent/40 gap-2 shadow-xs"
          title="Flip card (Space)"
          aria-label="Flip card"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
          <span>Flip Card</span>
        </Button>

        {/* Next Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isLast || !hasCards}
          onClick={onNext}
          className="h-11 w-11 rounded-xl text-foreground border-border hover:bg-accent/40 disabled:opacity-40 shadow-xs"
          title="Next card (→)"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Restart Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!hasCards}
        onClick={onRestart}
        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent"
        title="Restart deck (R)"
        aria-label="Restart deck"
      >
        <RotateCcw className="w-4.5 h-4.5" />
      </Button>
    </div>
  );
}
