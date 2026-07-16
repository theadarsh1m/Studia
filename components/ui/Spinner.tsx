import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-current border-t-transparent text-primary",
        {
          "h-4 w-4 border-2": size === "sm",
          "h-6 w-6 border-2": size === "default",
          "h-10 w-10 border-3": size === "lg",
        },
        className
      )}
      {...props}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
