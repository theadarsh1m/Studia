import React from "react";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/30 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side - Social Links */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <a href="https://theadarsh.me/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline transition-colors font-medium">Portfolio</a>
          <a href="https://www.linkedin.com/in/adarshsachan01" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline transition-colors font-medium">LinkedIn</a>
          <a href="https://github.com/theadarsh1m" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline transition-colors font-medium">GitHub</a>
        </div>

        {/* Right Side - Tech Stack */}
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
          <span>Built with</span>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            Next.js
          </a>
          <span>•</span>
          <a
            href="https://www.typescriptlang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            TypeScript
          </a>
          <span>•</span>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            Tailwind CSS
          </a>
          <span>•</span>
          <a
            href="https://www.framer.com/motion/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            Framer Motion
          </a>
        </div>
      </div>
    </footer>
  );
}
