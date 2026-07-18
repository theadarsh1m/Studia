import React from "react";
import { Sparkles, Heart } from "lucide-react";

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

        {/* Right Side - Built with love by Adarsh Sachan */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://theadarsh.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            Adarsh Sachan
          </a>
        </div>
      </div>
    </footer>
  );
}
