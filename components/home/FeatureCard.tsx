"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface FeatureCardProps {
  title: string;
  description: string[];
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full border-border bg-card/20 backdrop-blur-xs hover:bg-card/45 hover:border-border/80 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center gap-3.5 pb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-foreground border border-border">
            <Icon className="w-5 h-5 text-muted-foreground/90" />
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {description.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
