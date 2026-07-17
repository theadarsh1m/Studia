"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { QuizOption } from "./QuizOption";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onSelectOption: (index: number) => void;
}

export function QuizQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  selectedAnswer,
  isAnswered,
  onSelectOption,
}: QuizQuestionProps) {
  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Question Text */}
      <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-foreground">
        {question}
      </h3>

      {/* Options Stack */}
      <div className="flex flex-col gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = isAnswered && idx === correctAnswer;
          const isIncorrect = isAnswered && isSelected && idx !== correctAnswer;

          return (
            <QuizOption
              key={idx}
              text={option}
              index={idx}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              isDisabled={isAnswered}
              onSelect={() => onSelectOption(idx)}
            />
          );
        })}
      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/5 mt-2 flex gap-3 text-sm leading-relaxed">
              <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-500 block font-semibold mb-0.5">Explanation</strong>
                <p className="text-muted-foreground">{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
