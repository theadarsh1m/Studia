import { useState, useEffect, useRef } from "react";
import { StudyMaterial, Flashcard as FlashcardType } from "../lib/types/study";
import { FlashcardProgressData } from "../types/storage";

export interface FlashcardItem extends FlashcardType {
  originalIndex: number;
}

interface UseFlashcardPersistenceProps {
  result: StudyMaterial;
  initialProgress: FlashcardProgressData;
  onSave: (progress: FlashcardProgressData) => void;
}

export function useFlashcardPersistence({
  result,
  initialProgress,
  onSave,
}: UseFlashcardPersistenceProps) {
  // Initialize originalCards list using a pure state initializer function
  const [originalCards] = useState<FlashcardItem[]>(() => {
    return (result?.flashcards || []).map((card, idx) => ({
      ...card,
      originalIndex: idx,
    }));
  });

  // Initialize cards state (preserving restored shuffled orders if applicable)
  const [cards, setCards] = useState<FlashcardItem[]>(() => {
    const initialized = (result?.flashcards || []).map((card, idx) => ({
      ...card,
      originalIndex: idx,
    }));
    
    if (initialProgress.isShuffled && initialProgress.shuffledOrder && initialProgress.shuffledOrder.length > 0) {
      const orderMap = new Map(initialProgress.shuffledOrder.map((origIdx, pos) => [origIdx, pos]));
      return [...initialized].sort((a, b) => {
        const aPos = orderMap.get(a.originalIndex) ?? 0;
        const bPos = orderMap.get(b.originalIndex) ?? 0;
        return aPos - bPos;
      });
    }
    return initialized;
  });

  // Initialize other progress states directly from initialProgress props
  const [currentIndex, setCurrentIndex] = useState(initialProgress.currentIndex);
  const [isFlipped, setIsFlipped] = useState(initialProgress.isFlipped);
  const [isShuffled, setIsShuffled] = useState(initialProgress.isShuffled);
  const [filterBookmarks, setFilterBookmarks] = useState(initialProgress.filterBookmarks);
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(initialProgress.bookmarks);
  const [status, setStatus] = useState<Record<number, "easy" | "medium" | "hard">>(
    initialProgress.difficultyStatus as Record<number, "easy" | "medium" | "hard">
  );
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set(initialProgress.viewedCards));
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Track initial load status to prevent save overwrites on initialization
  const isInitializedRef = useRef(false);

  // Set initialization flag after mount to comply with React purity guidelines
  useEffect(() => {
    isInitializedRef.current = true;
  }, []);

  // Sync states on material adjustments (e.g. generating new session triggers mount, but just in case of updates)
  useEffect(() => {
    if (result?.flashcards) {
      const initialized = result.flashcards.map((card, idx) => ({
        ...card,
        originalIndex: idx,
      }));
      setTimeout(() => {
        setCards(initialized);
      }, 0);
    }
  }, [result]);

  // Trigger onSave callback whenever flashcard states change (Autosave)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const progress: FlashcardProgressData = {
      currentIndex,
      isFlipped,
      bookmarks,
      difficultyStatus: status,
      viewedCards: Array.from(viewedCards),
      isShuffled,
      shuffledOrder: cards.map((c) => c.originalIndex),
      filterBookmarks,
    };
    onSave(progress);
  }, [currentIndex, isFlipped, bookmarks, status, viewedCards, isShuffled, cards, filterBookmarks, onSave]);

  return {
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
  };
}
