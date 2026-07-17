"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Interactive Flashcards", "Practice Quizzes", "Study Materials"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center text-center py-12 sm:py-16 md:py-20 lg:py-24 max-w-4xl mx-auto px-4"
    >

      {/* Main Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.2] mb-8 sm:mb-10 flex flex-col items-center justify-center gap-2 sm:gap-4 perspective-1000"
      >
        <span>Transform Your Notes into</span>
        <div className="relative h-[1.3em] w-full flex items-center justify-center overflow-visible">
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, rotateX: -90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 90, y: -20 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="absolute bg-clip-text text-transparent bg-gradient-to-r from-black via-zinc-800 to-zinc-950 dark:from-zinc-300 dark:via-zinc-500 dark:to-zinc-200 whitespace-nowrap"
              style={{ transformOrigin: "center center -20px" }}
            >
              {words[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
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
