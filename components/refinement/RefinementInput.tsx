import React, { useState, useRef } from "react";
import { Send, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SuggestionChips } from "./SuggestionChips";
import { StudyMaterial } from "@/lib/types/study";
import { Button } from "@/components/ui/Button";
import { StudyError } from "@/lib/errors";

interface RefinementInputProps {
  onRefine: (prompt: string) => void;
  loading: boolean;
  disabled?: boolean;
  error?: StudyError | null;
  onCancel?: () => void;
}

export function RefinementInput({
  onRefine,
  loading,
  disabled = false,
  error = null,
  onCancel,
}: RefinementInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading || disabled) return;
    onRefine(value.trim());
    setValue("");
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onRefine(suggestion);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8 pb-12">
      <div className="relative">
        {/* Divider line separating the generated views from refinement */}
        <div className="absolute inset-x-0 -top-8 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t border-border/40" />
        </div>

        <h3 className="text-base font-bold text-foreground mb-4 mt-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          Refine your study material
        </h3>

        <Card className="border-border bg-card/35 backdrop-blur-xs shadow-md focus-within:shadow-lg focus-within:border-ring/30 focus-within:ring-1 focus-within:ring-ring/30 transition-all duration-300">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative flex items-center gap-2 bg-muted/20 border border-border/40 rounded-xl px-3 py-1.5 focus-within:border-ring/30 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={loading ? "Updating study material..." : value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={loading || disabled}
                  placeholder="Ask Gemini to modify the quiz, summary or flashcards..."
                  className={`flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground/60 py-1.5 focus:ring-0 ${
                    loading ? "text-muted-foreground font-medium animate-pulse" : "text-foreground"
                  }`}
                  aria-label="Refinement request prompt"
                />

                {loading ? (
                  <div className="flex items-center gap-2">
                    {onCancel && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive px-2 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={!value.trim() || disabled}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Send refinement request"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Suggestions chips wrapper */}
              <SuggestionChips onSelect={handleSuggestionSelect} disabled={loading || disabled} />
            </form>
          </CardContent>
        </Card>

        {/* Refinement Specific Error Banner */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 dark:text-red-400 flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Refinement failed: </span>
              {error.userMessage}
            </div>
            {error.details && (
              <pre className="hidden md:block max-h-16 overflow-auto font-mono text-[10px] text-muted-foreground/75 mt-1 border-t border-red-500/10 pt-1">
                {error.details}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
