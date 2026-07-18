import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { generateStudyRequest } from "../lib/request";
import { StudyError, ErrorType } from "../lib/errors";
import { StudyMaterial } from "../lib/types/study";

// Logging helper for development environments
const devLog = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[useGenerateStudy] ${message}`, ...args);
  }
};

const devError = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[useGenerateStudy] ${message}`, ...args);
  }
};

export function useGenerateStudy() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating...");
  const [error, setError] = useState<StudyError | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any pending request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        devLog("Unmounting, aborting active requests");
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Validate the text input
  const validateNotes = useCallback((notes: string, hasFile: boolean = false): boolean => {
    const trimmed = notes.trim();
    if (!trimmed) {
      setValidationError(null);
      return hasFile; // Valid if a file is attached, invalid but no error shown if empty
    }
    if (!hasFile && trimmed.length < 20) {
      setValidationError(`Study notes are too short. Minimum 20 characters (currently ${trimmed.length}).`);
      return false;
    }
    if (!hasFile && trimmed.length > 8000) {
      setValidationError(`Study notes are too long. Maximum 8000 characters (currently ${trimmed.length}).`);
      return false;
    }
    
    setValidationError(null);
    return true;
  }, []);

  // Abort any ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      devLog("Manually aborting request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      setLoadingText("Generating...");
      toast.error("✕ Request cancelled");
    }
  }, []);

  // Run the generation request
  const generate = useCallback(
    async (notes: string, file: File | null, onSuccess: (data: StudyMaterial) => void) => {
      const trimmed = notes.trim();
      
      // 1. Validation Guard
      if (!validateNotes(notes, !!file)) {
        devLog("Validation failed before request.");
        toast.warning("⚠ Validation failed", {
          description: "Please check the input constraints.",
        });
        return;
      }

      // 2. Abort previous request (if any)
      if (abortControllerRef.current) {
        devLog("Aborting previous request due to new request invocation.");
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      setLoading(true);
      setError(null);

      const toastId = toast.loading(file ? "Extracting PDF..." : "Generating study materials...", {
        description: file ? "Reading document text..." : "Analyzing text via Gemini 3.1 Flash Lite API...",
      });

      try {
        let combinedNotes = trimmed;

        if (file) {
          setLoadingText("Extracting PDF...");
          devLog("Uploading PDF for extraction...");
          
          const formData = new FormData();
          formData.append("file", file);

          const extractRes = await fetch("/api/extract-pdf", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          if (!extractRes.ok) {
            const errorData = await extractRes.json().catch(() => ({}));
            throw new StudyError(
              ErrorType.VALIDATION,
              errorData.error || "Failed to extract PDF text",
              errorData.error || "Failed to extract PDF text. The file might be empty, corrupted, or password-protected.",
              `PDF Extraction API returned status ${extractRes.status}`
            );
          }

          const extractData = await extractRes.json();
          const extractedText = extractData.text;

          combinedNotes = `Attached Document Content:\n${extractedText}\n\n${trimmed ? `User Instructions:\n${trimmed}` : ""}`.trim();
          
          if (abortControllerRef.current === controller) {
            setLoadingText("Generating...");
            toast.loading("Generating study materials...", {
              id: toastId,
              description: "Analyzing text via Gemini 3.1 Flash Lite API...",
            });
          }
        }

        devLog("Starting study material generation...");
        const resultData = await generateStudyRequest({
          notes: combinedNotes,
          signal: controller.signal,
        });

        // Ensure we only update state if this request is still the active one
        if (abortControllerRef.current === controller) {
          devLog("Study material generated successfully!");
          onSuccess(resultData);
          toast.success("✓ Study material generated", {
            id: toastId,
            description: "Your cards and quiz are ready.",
            duration: 4000,
          });
        }
      } catch (err: unknown) {
        // Check if aborted by caller or another request
        if (err instanceof Error && err.name === "AbortError") {
          devLog("Request aborted successfully.");
          // No need to show error UI, client already handled or cancelled
          return;
        }

        const studyError = err instanceof StudyError 
          ? err 
          : StudyError.unknown(err instanceof Error ? err.message : String(err));

        devError("Generation request failed:", studyError);

        if (abortControllerRef.current === controller) {
          setError(studyError);
          
          // Toast Notification based on error type
          if (studyError.type === ErrorType.CONNECTION || studyError.type === ErrorType.RATE_LIMIT) {
            toast.error("✕ AI unavailable", {
              id: toastId,
              description: studyError.userMessage,
              duration: 5000,
            });
          } else {
            toast.error("✕ Generation failed", {
              id: toastId,
              description: studyError.userMessage,
              duration: 5000,
            });
          }
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
          setLoadingText("Generating...");
          abortControllerRef.current = null;
        }
      }
    },
    [validateNotes]
  );

  return {
    loading,
    loadingText,
    error,
    validationError,
    validateNotes,
    generate,
    cancelRequest,
  };
}
