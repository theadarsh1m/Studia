"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { X, Sparkles, Loader2, ChevronDown, ChevronUp, Copy, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { StudyMaterial } from "@/lib/types/study";

export function StudyInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyMaterial | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const textareaRef = useAutoResize(text);
  const abortControllerRef = useRef<AbortController | null>(null);

  const maxChars = 5000;
  const characterCount = text.length;

  useEffect(() => {
    // Abort ongoing requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter some study notes first.");
      return;
    }

    // Cancel the previous ongoing request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setResult(null);

    const toastId = toast.loading("Generating study materials...", {
      description: "Calling Gemini 2.5 Flash API...",
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

      setResult(resData.data);
      setIsPanelOpen(true);
      
      toast.success("Study materials generated successfully!", {
        id: toastId,
        description: "Raw validated JSON loaded in the Developer Panel.",
        duration: 4000,
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === "AbortError") {
        // Request was aborted, don't show any error toasts
        return;
      }

      console.error("Generation error:", error);
      toast.error("Failed to generate study materials", {
        id: toastId,
        description: error.message || "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      // Only clear loading state if the active controller matches the one from this invocation
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
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

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast.success("Copied raw JSON to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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

              {/* Clear button (inside text area, only visible if text is present and not loading) */}
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
                      onClick={handleClear}
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
                className="text-xs text-muted-foreground/80 flex items-center gap-1.5"
              >
                <span>Need a sample?</span>
                <button
                  type="button"
                  onClick={handlePasteExample}
                  className="font-medium text-foreground hover:underline cursor-pointer"
                >
                  Try an example
                </button>
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

      {/* Developer Panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 border border-border bg-card/45 backdrop-blur-xs rounded-xl overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-semibold text-sm tracking-tight text-foreground">
                  Developer Panel <span className="text-xs font-normal text-muted-foreground">(Phase 2 - Raw JSON)</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  title="Copy JSON"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setResult(null);
                    toast.info("Cleared Developer Panel.");
                  }}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Clear Result"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border/40 mx-0.5" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  {isPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-border/20">
                    <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Developer Notice:</strong> This is a temporary developer panel displaying the raw, validated study material JSON returned by the backend. It will be replaced with rich flashcard and quiz components in Phase 3.
                    </div>
                    <pre className="p-4 bg-muted/60 dark:bg-muted/40 rounded-lg text-xs font-mono overflow-auto max-h-[450px] border border-border/85 text-foreground selection:bg-zinc-300 dark:selection:bg-zinc-800">
                      <code>{JSON.stringify(result, null, 2)}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

