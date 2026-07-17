import React from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetryButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function RetryButton({ onClick, loading = false, className }: RetryButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className={cn("gap-2 font-medium border border-border/80 hover:bg-accent/40 rounded-xl", className)}
      aria-label="Retry generation"
    >
      <RefreshCw className={cn("w-4 h-4 text-muted-foreground transition-all duration-300", loading && "animate-spin text-primary")} />
      <span>{loading ? "Retrying..." : "Retry"}</span>
    </Button>
  );
}
