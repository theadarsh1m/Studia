import { StudyError } from "./errors";
import { StudyMaterial } from "./types/study";

interface GenerateRequestOptions {
  notes: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function generateStudyRequest({
  notes,
  signal,
  timeoutMs = 45000, // 45 seconds timeout default
}: GenerateRequestOptions): Promise<StudyMaterial> {
  const controller = new AbortController();
  
  // Link the caller's signal to our internal controller
  if (signal) {
    signal.addEventListener("abort", () => {
      controller.abort();
    });
  }

  // Set up the timeout timer
  const timeoutId = setTimeout(() => {
    controller.abort("TIMEOUT");
  }, timeoutMs);

  try {
    const response = await fetch("/api/study/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Read the response content
    let resData: { success: boolean; data?: StudyMaterial; error?: string };
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
      if (errorMsg.includes("API key") || errorMsg.includes("configured")) {
        throw StudyError.configuration(errorMsg);
      }
      
      throw new Error(errorMsg || `Server responded with status ${response.status}`);
    }

    if (!resData.data) {
      throw StudyError.empty();
    }

    return resData.data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // If already a structured StudyError, just rethrow
    if (error instanceof StudyError) {
      throw error;
    }

    // Handle Abort Signals (Timeout or user cancellation)
    if (error instanceof Error && error.name === "AbortError") {
      // Check if it was aborted because of our timeout or caller's manual action
      const abortReason = controller.signal.reason;
      if (abortReason === "TIMEOUT") {
        throw StudyError.timeout();
      }
      // Return standard AbortError if it was manually cancelled by the caller
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);

    // Handle Network Disconnection Errors
    if (errorMsg.includes("fetch failed") || errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
      throw StudyError.connection();
    }

    // fallback to generic error mapping
    throw StudyError.unknown(errorMsg);
  }
}
