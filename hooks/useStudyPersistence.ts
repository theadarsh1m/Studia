import { useState, useEffect, useCallback } from "react";
import { StudyStorage } from "../lib/storage/studyStorage";
import { StudySessionData, FlashcardProgressData, QuizProgressData } from "../types/storage";
import { StudyMaterial } from "../lib/types/study";
import { toast } from "sonner";

export function useStudyPersistence() {
  const [session, setSession] = useState<StudySessionData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [relativeTime, setRelativeTime] = useState<string>("");

  // Restore session on mount (asynchronously to avoid cascading render warnings)
  useEffect(() => {
    const loaded = StudyStorage.get();
    if (loaded) {
      setTimeout(() => {
        setSession(loaded);
      }, 0);
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 0);
  }, []);

  // Update relative time strings dynamically
  useEffect(() => {
    if (!session?.updatedAt) {
      setTimeout(() => {
        setRelativeTime("");
      }, 0);
      return;
    }

    const updateTime = () => {
      const diffMs = Date.now() - session.updatedAt;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setRelativeTime("Last updated just now");
        return;
      }
      if (diffMins < 60) {
        setRelativeTime(`Last updated ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`);
        return;
      }
      
      const date = new Date(session.updatedAt);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isToday = new Date().toDateString() === date.toDateString();
      
      if (isToday) {
        setRelativeTime(`Last updated today at ${timeStr}`);
        return;
      }
      
      const isYesterday = new Date(Date.now() - 86400000).toDateString() === date.toDateString();
      if (isYesterday) {
        setRelativeTime(`Last updated yesterday at ${timeStr}`);
        return;
      }
      
      setRelativeTime(`Last updated on ${date.toLocaleDateString()} at ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [session?.updatedAt]);

  // Create new session upon successful generation
  const createNewSession = useCallback((notes: string, material: StudyMaterial, extractedPdfText?: string) => {
    const initialFlashcardProgress: FlashcardProgressData = {
      currentIndex: 0,
      isFlipped: false,
      bookmarks: {},
      difficultyStatus: {},
      viewedCards: [0],
      isShuffled: false,
      shuffledOrder: [],
      filterBookmarks: false,
    };

    const initialQuizProgress: QuizProgressData = {
      currentIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      mode: "quiz",
      correctCount: 0,
      incorrectCount: 0,
      wrongQuestionsIndex: [],
      activeQuestionsIndex: [],
      durationStr: "00:00",
      elapsedTimeOffset: 0,
      startTime: Date.now(),
    };

    const success = StudyStorage.save({
      originalNotes: notes,
      extractedPdfText,
      material,
      flashcardProgress: initialFlashcardProgress,
      quizProgress: initialQuizProgress,
    });

    if (success) {
      const updated = StudyStorage.get();
      setSession(updated);
    }
  }, []);

  // Autosave flashcard progress states
  const saveFlashcardProgress = useCallback((progress: FlashcardProgressData) => {
    const current = StudyStorage.get();
    if (!current) return;

    // Check if progress data actually changed to minimize writes
    const hasChanged = JSON.stringify(current.flashcardProgress) !== JSON.stringify(progress);
    if (!hasChanged) return;

    const success = StudyStorage.save({
      ...current,
      flashcardProgress: progress,
    });

    if (success) {
      const updated = StudyStorage.get();
      setSession(updated);
    }
  }, []);

  // Autosave quiz progress states
  const saveQuizProgress = useCallback((progress: QuizProgressData) => {
    const current = StudyStorage.get();
    if (!current) return;

    // Check if progress data actually changed to minimize writes
    const hasChanged = JSON.stringify(current.quizProgress) !== JSON.stringify(progress);
    if (!hasChanged) return;

    const success = StudyStorage.save({
      ...current,
      quizProgress: progress,
    });

    if (success) {
      const updated = StudyStorage.get();
      setSession(updated);
    }
  }, []);

  // Reset entire study session with confirmation guard handles
  const resetSession = useCallback(() => {
    const success = StudyStorage.clear();
    if (success) {
      setSession(null);
    }
  }, []);

  // Export active session file download trigger
  const exportSession = useCallback(() => {
    if (!session) {
      toast.error("No active study session to export.");
      return;
    }
    try {
      const jsonStr = StudyStorage.exportSession(session);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = session.material.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `aistudi-session-${safeTitle}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Study session exported successfully!");
    } catch (e) {
      toast.error("Failed to export study session.");
      console.error(e);
    }
  }, [session]);

  // Import uploaded session file and save
  const importSession = useCallback((jsonString: string): boolean => {
    const imported = StudyStorage.importSession(jsonString);
    if (imported) {
      setSession(imported);
      toast.success("Study session imported successfully!");
      return true;
    } else {
      toast.error("Failed to import study session. The file contains invalid or corrupted data.");
      return false;
    }
  }, []);

  // Update only a single section of the study material within the active session
  const updateSessionSection = useCallback((section: "summary" | "flashcards" | "quiz", content: any) => {
    const current = StudyStorage.get();
    if (!current) return;

    const updatedMaterial = {
      ...current.material,
      [section]: content,
    };

    let flashcardProgress = current.flashcardProgress;
    let quizProgress = current.quizProgress;

    // Targeted progress reset to prevent errors when structure shifts
    if (section === "flashcards") {
      flashcardProgress = {
        currentIndex: 0,
        isFlipped: false,
        bookmarks: current.flashcardProgress?.bookmarks || {},
        difficultyStatus: current.flashcardProgress?.difficultyStatus || {},
        viewedCards: [0],
        isShuffled: false,
        shuffledOrder: [],
        filterBookmarks: false,
      };
    } else if (section === "quiz") {
      quizProgress = {
        currentIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        mode: "quiz",
        correctCount: 0,
        incorrectCount: 0,
        wrongQuestionsIndex: [],
        activeQuestionsIndex: [],
        durationStr: "00:00",
        elapsedTimeOffset: 0,
        startTime: Date.now(),
      };
    }

    const success = StudyStorage.save({
      ...current,
      material: updatedMaterial,
      flashcardProgress,
      quizProgress,
    });

    if (success) {
      const updated = StudyStorage.get();
      setSession(updated);
    }
  }, []);

  return {
    session,
    isLoaded,
    relativeTime,
    createNewSession,
    updateSessionSection,
    saveFlashcardProgress,
    saveQuizProgress,
    resetSession,
    exportSession,
    importSession,
  };
}
