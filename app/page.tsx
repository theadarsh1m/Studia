import React from "react";
import { Hero } from "@/components/home/Hero";
import { StudyInput } from "@/components/home/StudyInput";
import { Features } from "@/components/home/Features";
import { EmptyState } from "@/components/home/EmptyState";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full pb-10">
      <h2 className="sr-only">AI Study Assistant Home Page</h2>
      <Hero />
      <StudyInput />
      <Features />
      <EmptyState />
    </div>
  );
}
