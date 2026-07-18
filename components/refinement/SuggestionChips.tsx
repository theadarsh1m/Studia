import React from "react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Make quiz harder",
  "Generate interview questions",
  "Explain simply",
  "Add more flashcards",
  "Shorter summary",
  "Convert to checklist",
  "Add mnemonics",
  "Focus on important topics",
];

export function SuggestionChips({ onSelect, disabled = false }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
