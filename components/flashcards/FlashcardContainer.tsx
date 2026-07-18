"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";
import { StudyMaterial } from "@/lib/types/study";
import { Flashcard } from "./Flashcard";
import { FlashcardControls } from "./FlashcardControls";
import { FlashcardProgress } from "./FlashcardProgress";
import { FlashcardStats } from "./FlashcardStats";
import { Button } from "@/components/ui/Button";
import { useFlashcardPersistence } from "@/hooks/useFlashcardPersistence";
import { FlashcardProgressData } from "@/types/storage";

interface FlashcardContainerProps {
  result: StudyMaterial;
  initialProgress?: FlashcardProgressData;
  onSaveProgress?: (progress: FlashcardProgressData) => void;
}

export function FlashcardContainer({
  result,
  initialProgress,
  onSaveProgress,
}: FlashcardContainerProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const defaultProgress: FlashcardProgressData = {
    currentIndex: 0,
    isFlipped: false,
    bookmarks: {},
    difficultyStatus: {},
    viewedCards: [0],
    isShuffled: false,
    shuffledOrder: [],
    filterBookmarks: false,
  };

  const progressToUse = initialProgress || defaultProgress;
  const noop = () => {};
  const onSaveToUse = onSaveProgress || noop;

  // Delegate state tracking to the custom persistence hook
  const {
    cards,
    setCards,
    originalCards,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    setIsFlipped,
    isShuffled,
    setIsShuffled,
    filterBookmarks,
    setFilterBookmarks,
    bookmarks,
    setBookmarks,
    status,
    setStatus,
    viewedCards,
    setViewedCards,
    direction,
    setDirection,
  } = useFlashcardPersistence({
    result,
    initialProgress: progressToUse,
    onSave: onSaveToUse,
  });

  // Define filter logic
  const bookmarkedCards = cards.filter((card) => bookmarks[card.originalIndex]);
  const activeDeck = filterBookmarks ? bookmarkedCards : cards;

  // Safe boundaries
  const hasCards = activeDeck.length > 0;
  const currentCard = hasCards ? activeDeck[currentIndex] : null;

  // Action definitions wrapped in useCallback to stabilize dependencies
  const handleNext = useCallback(() => {
    if (currentIndex < activeDeck.length - 1) {
      const nextIndex = currentIndex + 1;
      setDirection("right");
      setIsFlipped(false);
      // Small timeout to allow flip-back before slide transition
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setViewedCards((prev) => {
          const next = new Set(prev);
          const nextCard = activeDeck[nextIndex];
          if (nextCard) {
            next.add(nextCard.originalIndex);
          }
          return next;
        });
      }, 100);
    }
  }, [currentIndex, activeDeck, setCurrentIndex, setIsFlipped, setDirection, setViewedCards]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setDirection("left");
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex);
        setViewedCards((prev) => {
          const next = new Set(prev);
          const prevCard = activeDeck[prevIndex];
          if (prevCard) {
            next.add(prevCard.originalIndex);
          }
          return next;
        });
      }, 100);
    }
  }, [currentIndex, activeDeck, setCurrentIndex, setIsFlipped, setDirection, setViewedCards]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards((prev) => {
      const next = new Set(prev);
      if (cards[0]) {
        next.add(cards[0].originalIndex);
      }
      return next;
    });
  }, [cards, setCurrentIndex, setIsFlipped, setViewedCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, [setIsFlipped]);

  const handleShuffle = useCallback(() => {
    if (isShuffled) {
      // Restore original sorting, preserving bookmarks/evaluations
      const restored = [...originalCards];
      setCards(restored);
      setIsShuffled(false);
      // Reset index to match whichever card we were previously looking at
      if (currentCard) {
        const newIdx = restored.findIndex((c) => c.originalIndex === currentCard.originalIndex);
        setCurrentIndex(newIdx >= 0 ? newIdx : 0);
        setViewedCards((prev) => {
          const next = new Set(prev);
          next.add(currentCard.originalIndex);
          return next;
        });
      } else {
        setCurrentIndex(0);
      }
    } else {
      // Randomize cards order
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setIsShuffled(true);
      if (currentCard) {
        const newIdx = shuffled.findIndex((c) => c.originalIndex === currentCard.originalIndex);
        setCurrentIndex(newIdx >= 0 ? newIdx : 0);
        setViewedCards((prev) => {
          const next = new Set(prev);
          next.add(currentCard.originalIndex);
          return next;
        });
      } else {
        setCurrentIndex(0);
      }
    }
    setIsFlipped(false);
  }, [isShuffled, cards, currentCard, originalCards, setCards, setIsShuffled, setCurrentIndex, setViewedCards, setIsFlipped]);

  const handleToggleBookmark = useCallback((origIdx: number) => {
    setBookmarks((prev) => ({
      ...prev,
      [origIdx]: !prev[origIdx],
    }));
  }, [setBookmarks]);

  const handleRateDifficulty = useCallback((origIdx: number, rating: "easy" | "medium" | "hard") => {
    setStatus((prev) => ({
      ...prev,
      [origIdx]: rating,
    }));
  }, [setStatus]);

  // Keyboard Navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts if user is typing in notes field!
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (!hasCards) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case " ":
          e.preventDefault();
          handleFlip();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleRestart();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasCards, handlePrevious, handleNext, handleFlip, handleRestart]);

  // Compute stats safely without accessing refs during render
  const totalOriginalCount = result.flashcards.length;
  const viewedCount = viewedCards.size;
  const remainingCount = Math.max(0, totalOriginalCount - viewedCount);
  const completedCount = Object.keys(status).length;
  
  const easyCount = Object.values(status).filter((s) => s === "easy").length;
  const mediumCount = Object.values(status).filter((s) => s === "medium").length;
  const hardCount = Object.values(status).filter((s) => s === "hard").length;

  const slideVariants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "right" ? 180 : -180,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? -180 : 180,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 border border-border/80 bg-card/45 backdrop-blur-xs rounded-2xl p-6 md:p-8 shadow-lg">
      
      {/* Title & Filter Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-5 mb-6">
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Study Deck: {result.title}
          </h3>
          <motion.div
            key={result.summary}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="text-xs text-muted-foreground mt-1 max-w-lg cursor-pointer hover:text-foreground/80 transition-colors select-none"
            title="Click to expand/collapse full summary"
          >
            {isSummaryExpanded ? (
              <p className="whitespace-pre-wrap leading-relaxed">{result.summary}</p>
            ) : (
              <p className="line-clamp-2 md:line-clamp-3">
                {result.summary}
                {result.summary.length > 90 && (
                  <span className="text-primary font-semibold ml-1 hover:underline">... read more</span>
                )}
              </p>
            )}
          </motion.div>
        </div>

        <Button
          type="button"
          variant={filterBookmarks ? "secondary" : "outline"}
          onClick={() => {
            setFilterBookmarks(!filterBookmarks);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`h-9 rounded-xl text-xs font-semibold gap-1.5 transition-all duration-300 ${
            filterBookmarks
              ? "bg-amber-500/10 border-amber-500/35 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "hover:bg-accent/40"
          }`}
          aria-label="Filter bookmarked cards"
        >
          <Star className={`w-3.5 h-3.5 ${filterBookmarks ? "fill-current" : ""}`} />
          <span>Bookmarks ({bookmarkedCards.length})</span>
        </Button>
      </div>

      {/* Main Learning Canvas */}
      {hasCards && currentCard ? (
        <div className="relative">
          
          {/* Card slide transitions */}
          <div className="relative overflow-hidden min-h-[350px] w-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`${currentCard.originalIndex}-${isShuffled}`} // Keep animations unique
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Flashcard
                  question={currentCard.question}
                  answer={currentCard.answer}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  isBookmarked={!!bookmarks[currentCard.originalIndex]}
                  onToggleBookmark={() => handleToggleBookmark(currentCard.originalIndex)}
                  difficulty={status[currentCard.originalIndex]}
                  onRateDifficulty={(rating) =>
                    handleRateDifficulty(currentCard.originalIndex, rating)
                  }
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress and Indicator */}
          <FlashcardProgress current={currentIndex + 1} total={activeDeck.length} />

          {/* Controls Bar */}
          <FlashcardControls
            onPrevious={handlePrevious}
            onNext={handleNext}
            onFlip={handleFlip}
            onShuffle={handleShuffle}
            onRestart={handleRestart}
            isFirst={currentIndex === 0}
            isLast={currentIndex === activeDeck.length - 1}
            isShuffled={isShuffled}
            hasCards={hasCards}
          />
        </div>
      ) : (
        /* Empty State (when filtered by bookmark and no bookmarks exist) */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
            <Bookmark className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-foreground">No Bookmarked Cards</h4>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            There are no bookmarked cards in this study deck. Turn off bookmarks filter or flag cards using the star button inside the deck cards.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFilterBookmarks(false)}
            className="mt-5 rounded-xl text-xs font-semibold hover:bg-accent/40"
          >
            Show All Cards
          </Button>
        </motion.div>
      )}

      {/* Statistics dashboard */}
      <FlashcardStats
        viewedCount={viewedCount}
        remainingCount={remainingCount}
        completedCount={completedCount}
        easyCount={easyCount}
        mediumCount={mediumCount}
        hardCount={hardCount}
      />
    </div>
  );
}
