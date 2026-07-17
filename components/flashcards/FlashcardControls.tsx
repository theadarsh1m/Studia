"use client";

import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SpecularButton from "@/components/ui/SpecularButton";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

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
        <SpecularButton
          type="button"
          disabled={isFirst || !hasCards}
          onClick={onPrevious}
          className="!p-0 !h-11 !w-11 !rounded-xl flex items-center justify-center"
          baseColor={isDark ? "#27272a" : "#f4f4f5"}
          lineColor={isDark ? "#e4e4e7" : "#52525b"}
          tint={isDark ? "#09090b" : "#ffffff"}
          textColor="hsl(var(--foreground))"
          radius={12}
        >
          <ChevronLeft className="w-5 h-5" />
        </SpecularButton>

        {/* Flip Button */}
        <SpecularButton
          type="button"
          onClick={onFlip}
          disabled={!hasCards}
          className="!h-11 !px-5 !rounded-xl text-sm gap-2"
          baseColor={isDark ? "#27272a" : "#f4f4f5"}
          lineColor={isDark ? "#e4e4e7" : "#52525b"}
          tint={isDark ? "#09090b" : "#ffffff"}
          textColor="hsl(var(--foreground))"
          radius={12}
        >
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <span>Flip Card</span>
          </div>
        </SpecularButton>

        {/* Next Button */}
        <SpecularButton
          type="button"
          disabled={isLast || !hasCards}
          onClick={onNext}
          className="!p-0 !h-11 !w-11 !rounded-xl flex items-center justify-center"
          baseColor={isDark ? "#27272a" : "#f4f4f5"}
          lineColor={isDark ? "#e4e4e7" : "#52525b"}
          tint={isDark ? "#09090b" : "#ffffff"}
          textColor="hsl(var(--foreground))"
          radius={12}
        >
          <ChevronRight className="w-5 h-5" />
        </SpecularButton>
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
