import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { StudyError, ErrorType } from "../lib/errors";
import { StudyMaterial } from "../lib/types/study";

const devLog = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[useRefinement] ${message}`, ...args);
  }
};

const devError = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[useRefinement] ${message}`, ...args);
  }
};

export interface RefinementResult {
  updatedSection: "summary" | "flashcards" | "quiz";
  content: string | any[];
}

export function useRefinement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StudyError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        devLog("Unmounting, aborting active requests");
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      devLog("Manually aborting refinement request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      toast.error("✕ Refinement cancelled");
    }
  }, []);

  const refine = useCallback(
    async (
      notes: string,
      currentMaterial: StudyMaterial,
      refinementPrompt: string,
      onSuccess: (data: RefinementResult) => void
    ) => {
      if (!refinementPrompt.trim()) {
        toast.warning("⚠ Refinement prompt cannot be empty.");
        return;
      }

      if (abortControllerRef.current) {
        devLog("Aborting previous request due to new refinement invocation.");
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      const toastId = toast.loading("Updating study material...", {
        description: "Applying refinement prompt via Gemini...",
      });

      try {
        devLog("Starting study material refinement...");
        const response = await fetch("/api/study/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes,
            currentMaterial,
            refinementPrompt: refinementPrompt.trim(),
          }),
          signal: controller.signal,
        });

        let resData: { success: boolean; data?: RefinementResult; error?: string };
        try {
          resData = await response.json();
        } catch {
          throw StudyError.parse("Failed to decode JSON response from server.");
        }

        if (!response.ok || !resData.success) {
          const errorMsg = resData.error || "";
          if (response.status === 429 || errorMsg.includes("Rate limit") || errorMsg.includes("Quota")) {
            throw StudyError.rateLimit();
          }
          if (response.status === 422 || errorMsg.includes("validation") || errorMsg.includes("structure")) {
            throw StudyError.validation(errorMsg);
          }
          throw new Error(errorMsg || `Server responded with status ${response.status}`);
        }

        if (!resData.data) {
          throw StudyError.empty();
        }

        if (abortControllerRef.current === controller) {
          devLog("Study material refined successfully!");
          onSuccess(resData.data);
          toast.success("✓ Study material updated", {
            id: toastId,
            description: "Your changes have been applied.",
            duration: 4000,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          devLog("Refinement request aborted.");
          return;
        }

        const studyError = err instanceof StudyError
          ? err
          : new StudyError(
              ErrorType.UNKNOWN,
              err instanceof Error ? err.message : String(err),
              err instanceof Error ? err.message : "An unexpected error occurred. Please try again.",
              err instanceof Error ? err.stack : undefined
            );

        devError("Refinement request failed:", studyError);

        if (abortControllerRef.current === controller) {
          setError(studyError);
          toast.error("✕ Update failed", {
            id: toastId,
            description: studyError.userMessage,
            duration: 5000,
          });
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  return {
    loading,
    error,
    refine,
    cancelRequest,
  };
}
