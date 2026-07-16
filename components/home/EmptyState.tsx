"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function EmptyState() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-16">
      <Card className="border-dashed border-2 border-border/80 bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center text-center p-12">
          {/* Large Illustration / Icon */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-secondary border border-border mb-6">
            <BookOpen className="w-7 h-7 text-muted-foreground/80" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-ping" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Study Material Yet
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Generated flashcards and quizzes will appear here after AI processing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
