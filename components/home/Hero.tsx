"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Sparkles } from "lucide-react";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 16,
      },
    },
  } as const;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center text-center py-12 sm:py-16 md:py-20 lg:py-24 max-w-4xl mx-auto px-4"
    >
      {/* Badge Indicator */}
      <motion.div variants={itemVariants} className="mb-5 sm:mb-6">
        <Badge
          variant="outline"
          className="px-3.5 py-1 text-xs font-medium gap-1.5 bg-muted/20 border-border text-muted-foreground rounded-full select-none shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 animate-pulse" />
          <span>Next-Generation AI Learning Platform</span>
        </Badge>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15] mb-5 sm:mb-6"
      >
        Transform Your Notes into{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-900 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-50">
          Interactive Flashcards
        </span>{" "}
        &{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-650 to-zinc-950 dark:from-zinc-50 dark:via-zinc-400 dark:to-zinc-200">
          Quizzes
        </span>
      </motion.h1>

      {/* Description Paragraph */}
      <motion.p
        variants={itemVariants}
        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed"
      >
        Supercharge your study workflow. Paste your raw lecture transcripts, textbook notes, or research papers, and let our AI compile key concepts in seconds.
      </motion.p>
    </motion.section>
  );
}
