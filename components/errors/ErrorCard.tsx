import React from "react";
import { AlertCircle, FileEdit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RetryButton } from "./RetryButton";
import { StudyError } from "@/lib/errors";
import { motion } from "framer-motion";

interface ErrorCardProps {
  error: StudyError;
  onRetry: () => void;
  onEditNotes: () => void;
  loading?: boolean;
}

export function ErrorCard({ error, onRetry, onEditNotes, loading = false }: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto my-6"
    >
      <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-xs shadow-md">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h4 className="font-bold text-foreground text-lg">
              Generation Error
            </h4>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {error.userMessage}
            </p>
          </div>

          {/* If in dev mode, show the technical details in a tiny text block */}
          {process.env.NODE_ENV === "development" && error.details && (
            <div className="w-full text-left p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-border/40 max-h-36 overflow-auto text-xs font-mono text-muted-foreground/80 mt-2">
              <span className="font-bold text-foreground">Dev Debug Info:</span>
              <pre className="mt-1 whitespace-pre-wrap">{error.details}</pre>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <RetryButton onClick={onRetry} loading={loading} />
            <Button
              type="button"
              variant="ghost"
              onClick={onEditNotes}
              className="gap-2 font-medium hover:bg-accent/40 rounded-xl"
              aria-label="Edit study notes"
            >
              <FileEdit className="w-4 h-4 text-muted-foreground" />
              <span>Edit Notes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
