"use client";

import React from "react";
import { Eye, Clock, Award, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface FlashcardStatsProps {
  viewedCount: number;
  remainingCount: number;
  completedCount: number; // Cards with difficulty rating
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function FlashcardStats({
  viewedCount,
  remainingCount,
  completedCount,
  easyCount,
  mediumCount,
  hardCount,
}: FlashcardStatsProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-8">
      <Card className="border border-border/80 bg-card/25 backdrop-blur-xs shadow-xs overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 border-b border-border/40 pb-3">
            <BarChart className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Deck Statistics
            </h4>
          </div>

          {/* Primary Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/40 border border-border/20 text-center">
              <Eye className="w-4.5 h-4.5 text-blue-500 mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">
                {viewedCount}
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">
                Viewed
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/40 border border-border/20 text-center">
              <Clock className="w-4.5 h-4.5 text-amber-500 mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">
                {remainingCount}
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">
                Remaining
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/40 border border-border/20 text-center">
              <Award className="w-4.5 h-4.5 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">
                {completedCount}
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">
                Rated
              </span>
            </div>
          </div>

          {/* Difficulty Ratings Breakdown */}
          {(easyCount > 0 || mediumCount > 0 || hardCount > 0) && (
            <div className="flex flex-col gap-2 pt-3 border-t border-border/40">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center sm:text-left">
                Difficulty breakdown
              </span>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Easy: <strong className="text-foreground">{easyCount}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Medium: <strong className="text-foreground">{mediumCount}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Hard: <strong className="text-foreground">{hardCount}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
