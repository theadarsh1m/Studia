import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen, GraduationCap, BarChart2, FileText } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8 space-y-8 animate-fade-in select-none">
      {/* Loading header tracker */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Tabs placeholder */}
      <div className="flex justify-center gap-2 mb-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>

      {/* Summary Skeleton */}
      <Card className="border-border bg-card/20 backdrop-blur-xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[40%]" />
          </div>
        </CardContent>
      </Card>

      {/* Grid columns for cards and stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Flashcards Skeleton (Takes 2 cols on md) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          {/* Main card box mockup */}
          <Card className="border-border bg-card/25 min-h-[220px] flex flex-col justify-between p-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-[85%]" />
              <Skeleton className="h-5 w-[60%]" />
            </div>
            <div className="flex justify-center mt-6">
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </Card>
          {/* Navigation controls */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>

        {/* Statistics Skeleton (Takes 1 col on md) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BarChart2 className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Card className="border-border bg-card/25 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-6" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quiz Skeleton */}
      <Card className="border-border bg-card/20 backdrop-blur-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="w-4 h-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          {/* Question placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="h-5 w-[40%]" />
          </div>
          {/* Options placeholder */}
          <div className="space-y-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default LoadingSkeleton;
