"use client";

import React from "react";
import { CreditCard, Award, Zap } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function Features() {
  const featuresList = [
    {
      title: "Flashcards",
      description: ["Active Recall", "Flip Cards", "Better Retention"],
      icon: CreditCard,
    },
    {
      title: "Quiz",
      description: ["Interactive MCQs", "Instant Feedback", "Retest Incorrect Answers"],
      icon: Award,
    },
    {
      title: "Study Smarter",
      description: ["AI Summary", "Faster Revision", "Organized Learning"],
      icon: Zap,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuresList.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}
