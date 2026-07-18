import React from "react";
import { FileText, X } from "lucide-react";
import { formatFileSize } from "@/lib/fileValidation";
import { motion } from "framer-motion";

interface AttachmentChipProps {
  file: File;
  onRemove: () => void;
}

export function AttachmentChip({ file, onRemove }: AttachmentChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 bg-muted/40 border border-border/60 rounded-xl px-3 py-2 w-fit mb-3 max-w-full overflow-hidden shadow-sm backdrop-blur-sm group"
    >
      <div className="flex items-center justify-center bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 p-2 rounded-lg shrink-0">
        <FileText className="w-4 h-4" />
      </div>
      
      <div className="flex flex-col min-w-0 mr-2">
        <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
          {file.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 p-1.5 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/40"
        aria-label={`Remove attached file ${file.name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
