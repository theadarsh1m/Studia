"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAutoResize } from "@/hooks/use-auto-resize";

export function StudyInput() {
  const [text, setText] = useState("");
  const textareaRef = useAutoResize(text);

  const maxChars = 5000;
  const characterCount = text.length;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter some study notes first.");
      return;
    }
    toast.info("AI integration will be added in Phase 2.", {
      description: "Frontend layout and components are ready for API connection.",
      duration: 4000,
    });
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
                placeholder="Paste your study notes here..."
                className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 min-h-[140px] text-base leading-relaxed resize-none text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-none"
                aria-label="Study notes input"
              />

              {/* Clear button (inside text area, only visible if text is present) */}
              <AnimatePresence>
                {text.length > 0 && (
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
            {text.length === 0 && (
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
                disabled={!text.trim()}
                className="w-full sm:w-auto font-medium gap-2 relative overflow-hidden"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Study Material</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
