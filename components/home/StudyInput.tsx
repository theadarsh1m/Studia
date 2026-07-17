"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { X, Sparkles, Loader2, BookOpen, GraduationCap, Clock, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { StudyMaterial } from "@/lib/types/study";
import { FlashcardContainer } from "@/components/flashcards/FlashcardContainer";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { useStudyPersistence } from "@/hooks/useStudyPersistence";
import { Features } from "./Features";
import { EmptyState } from "./EmptyState";

export function StudyInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyMaterial | null>(null);
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");
  const [showResetModal, setShowResetModal] = useState(false);
  
  const textareaRef = useAutoResize(text);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const maxChars = 5000;
  const characterCount = text.length;

  // Master persistence state hook
  const {
    session,
    isLoaded,
    relativeTime,
    createNewSession,
    saveFlashcardProgress,
    saveQuizProgress,
    resetSession,
    exportSession,
    importSession,
  } = useStudyPersistence();

  // Cancel ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Sync result & input notes from loaded session state
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        if (session) {
          setResult(session.material);
          setText(session.originalNotes);
        } else {
          setResult(null);
          setText("");
        }
      }, 0);
    }
  }, [isLoaded, session]);

  // Handle Escape key to close the reset modal
  useEffect(() => {
    if (!showResetModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResetModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResetModal]);

  // Focus the cancel button when the reset modal opens for accessibility
  useEffect(() => {
    if (showResetModal) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }
  }, [showResetModal]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter some study notes first.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    const toastId = toast.loading("Generating study materials...", {
      description: "Calling Gemini 2.5 Flash Lite API...",
    });

    try {
      const response = await fetch("/api/study/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: text.trim() }),
        signal: controller.signal,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || `HTTP error! status: ${response.status}`);
      }

      // Persist the newly validated study material
      createNewSession(text.trim(), resData.data);
      setActiveTab("flashcards");
      
      toast.success("Study materials generated successfully!", {
        id: toastId,
        description: "Your interactive study materials are ready.",
        duration: 4000,
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === "AbortError") {
        return;
      }

      console.error("Generation error:", error);
      toast.error("Failed to generate study materials", {
        id: toastId,
        description: error.message || "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const handleClearInput = () => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePasteExample = () => {
    setText(
      "Photosynthesis is the process by which green plants convert sunlight into chemical energy. During this process, carbon dioxide and water are combined to produce glucose and oxygen, driven by light energy captured by chlorophyll."
    );
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (resultStr) {
        importSession(resultStr);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-16">
      <Card className="relative overflow-hidden border-border bg-card/35 backdrop-blur-xs shadow-md focus-within:shadow-lg focus-within:border-ring/30 focus-within:ring-1 focus-within:ring-ring/30 transition-all duration-300">
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="relative group">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                disabled={loading}
                placeholder="Paste your study notes here..."
                className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 min-h-[140px] text-base leading-relaxed resize-none text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-none disabled:opacity-50"
                aria-label="Study notes input"
              />

              {/* Clear button */}
              <AnimatePresence>
                {text.length > 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleClearInput}
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label="Clear text input"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick helper to paste example if empty */}
            {text.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground/80 flex flex-wrap items-center gap-1.5"
              >
                <span>Need a sample?</span>
                <button
                  type="button"
                  onClick={handlePasteExample}
                  className="font-medium text-foreground hover:underline cursor-pointer focus:outline-none"
                >
                  Try an example
                </button>
                <span>or</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-foreground hover:underline cursor-pointer focus:outline-none"
                >
                  import a session
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-border/40">
              {/* Character counter */}
              <div
                className={`text-xs transition-colors duration-200 ${
                  characterCount >= maxChars * 0.9
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {characterCount.toLocaleString()} / {maxChars.toLocaleString()} characters
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                size="lg"
                disabled={loading || !text.trim()}
                className="w-full sm:w-auto font-medium gap-2 relative overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{loading ? "Generating..." : "Generate Study Material"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Relative Metadata bar */}
      {result && (
        <div className="w-full max-w-2xl mx-auto mt-6 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/30 pb-3 animate-fade-in select-none">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{relativeTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={exportSession}
              className="h-7 text-xs font-semibold px-2.5 rounded-lg hover:bg-accent/40 text-foreground gap-1.5 transition-all"
              aria-label="Export study session JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="h-7 text-xs font-semibold px-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 gap-1.5 text-muted-foreground transition-all"
              aria-label="Clear active session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      {result && (
        <div className="flex justify-center mt-6 mb-2">
          <div className="relative p-1 bg-muted/40 backdrop-blur-md rounded-xl border border-border/60 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab("flashcards")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold h-8 gap-1.5 transition-all duration-300 ${
                activeTab === "flashcards"
                  ? "bg-background text-foreground shadow-xs border border-border/40 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab("quiz")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold h-8 gap-1.5 transition-all duration-300 ${
                activeTab === "quiz"
                  ? "bg-background text-foreground shadow-xs border border-border/40 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Practice Quiz</span>
            </Button>
          </div>
        </div>
      )}

      {/* Interactive Flashcard / Quiz views with clean transitions */}
      <AnimatePresence mode="wait">
        {result && activeTab === "flashcards" && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <FlashcardContainer
              result={result}
              initialProgress={session?.flashcardProgress}
              onSaveProgress={saveFlashcardProgress}
            />
          </motion.div>
        )}
        {result && activeTab === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <QuizContainer
              result={result}
              onBackToFlashcards={() => setActiveTab("flashcards")}
              initialProgress={session?.quizProgress}
              onSaveProgress={saveQuizProgress}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marketing features and empty state panel - only rendered when no results exist */}
      {!result && (
        <>
          <Features />
          <EmptyState />
        </>
      )}

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xs"
            />
            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-modal-title"
              aria-describedby="reset-modal-description"
            >
              <h3 id="reset-modal-title" className="text-lg font-bold text-foreground">
                Reset Study Session?
              </h3>
              <p id="reset-modal-description" className="text-sm text-muted-foreground mt-3 leading-relaxed">
                This will permanently clear your generated study notes, flashcards progress, quiz scores, bookmarks, and difficulty ratings. Your preferences will be preserved.
              </p>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  ref={cancelButtonRef}
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetModal(false)}
                  className="rounded-xl px-4 h-10 text-xs font-semibold hover:bg-accent/40"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    resetSession();
                    setShowResetModal(false);
                    toast.success("Study session cleared successfully.");
                  }}
                  className="rounded-xl px-4 h-10 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white dark:bg-red-500/10 dark:text-red-500 dark:border dark:border-red-500/25 dark:hover:bg-red-500/15"
                >
                  Reset Session
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
