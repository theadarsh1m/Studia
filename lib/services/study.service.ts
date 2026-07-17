import { getGeminiModel, genAI } from "../ai/gemini";
import { STUDY_SYSTEM_PROMPT } from "../prompts/studyPrompt";
import { studyMaterialSchema } from "../validators/studySchema";
import { extractJson } from "../utils/extractJson";
import { StudyMaterial } from "../types/study";
import { GenerativeModel } from "@google/generative-ai";

export class StudyService {
  private static async executeGeneration(
    model: GenerativeModel,
    prompt: string,
    signal?: AbortSignal
  ): Promise<StudyMaterial> {
    const response = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: STUDY_SYSTEM_PROMPT,
      },
      { signal }
    );

    const responseText = response.response.text();
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const extractedJsonText = extractJson(responseText);
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(extractedJsonText);
    } catch (err) {
      throw new Error(`Failed to parse extracted JSON: ${(err as Error).message}`);
    }

    const validationResult = studyMaterialSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(`AI generated invalid output structure: ${errorDetails}`);
    }

    return validationResult.data;
  }

  static async generateStudyMaterial(notes: string, signal?: AbortSignal): Promise<StudyMaterial> {
    const model = getGeminiModel();
    const prompt = `Study Notes:\n${notes}`;

    try {
      return await this.executeGeneration(model, prompt, signal);
    } catch (error: unknown) {
      const isAbort = (error instanceof Error && error.name === "AbortError") || signal?.aborted;
      if (isAbort) {
        throw error;
      }

      const errMsg = error instanceof Error ? error.message : String(error);
      const errStatus = typeof error === "object" && error !== null && "status" in error
        ? (error as { status: unknown }).status
        : undefined;

      // If the model fails due to 404 / retirement, attempt automatic fallback to gemini-3.1-flash-lite
      const isRetiredOrMissing =
        errStatus === 404 ||
        errMsg.includes("404") ||
        errMsg.includes("not available") ||
        errMsg.includes("no longer available") ||
        errMsg.includes("not found");
      
      const currentModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

      if (isRetiredOrMissing && currentModelName === "gemini-2.5-flash-lite") {
        console.warn("gemini-2.5-flash-lite is retired or unavailable. Falling back to gemini-3.1-flash-lite...");
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite",
          });
          return await this.executeGeneration(fallbackModel, prompt, signal);
        } catch (fallbackError: unknown) {
          console.error("Fallback to gemini-3.1-flash-lite failed:", fallbackError);
        }
      }

      // Map standard API rate limits / quota issues
      if (
        errStatus === 429 ||
        errMsg.includes("429") ||
        errMsg.includes("Quota exceeded") ||
        errMsg.includes("RESOURCE_EXHAUSTED")
      ) {
        throw new Error("Rate limit exceeded. Please try again in a few moments.");
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(errMsg);
    }
  }
}
