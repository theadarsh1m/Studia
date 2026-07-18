import { getGeminiModel, genAI } from "../ai/gemini";
import { STUDY_SYSTEM_PROMPT } from "../prompts/studyPrompt";
import { studyMaterialSchema, refinementResponseSchema, validateRefinementContent } from "../validators/studySchema";
import { extractJson } from "../utils/extractJson";
import { StudyMaterial } from "../types/study";
import { GenerativeModel } from "@google/generative-ai";

export interface RefinementResult {
  updatedSection: "summary" | "flashcards" | "quiz";
  content: string | any[];
}

export class StudyService {
  private static async executeGeneration(
    model: GenerativeModel,
    prompt: string,
    signal?: AbortSignal,
    systemInstruction: string = STUDY_SYSTEM_PROMPT
  ): Promise<StudyMaterial> {
    const response = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction,
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

      // If the primary model fails for ANY reason, attempt fallback cascades
      const currentModelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

      if (currentModelName !== "gemini-3.5-flash") {
        console.warn(`Primary model ${currentModelName} failed: ${errMsg}. Falling back to gemini-3.5-flash...`);
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
          });
          return await this.executeGeneration(fallbackModel, prompt, signal);
        } catch (fallbackError: unknown) {
          console.error("Fallback to gemini-3.5-flash failed:", fallbackError);
        }
      } else {
        // If gemini-3.5-flash itself fails, fallback to gemini-3.1-flash-lite
        console.warn(`Primary model gemini-3.5-flash failed: ${errMsg}. Falling back to gemini-3.1-flash-lite...`);
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

  private static async executeRefinement(
    model: GenerativeModel,
    prompt: string,
    signal?: AbortSignal
  ): Promise<RefinementResult> {
    const { REFINEMENT_SYSTEM_PROMPT } = require("../prompts/refinementPrompt");
    const response = await model.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: REFINEMENT_SYSTEM_PROMPT,
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

    const validationResult = refinementResponseSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(`AI generated invalid output structure for refinement: ${errorDetails}`);
    }

    const { updatedSection, content } = validationResult.data;
    
    // Perform targeted validation based on the section
    try {
      validateRefinementContent(updatedSection, content);
    } catch (err) {
      throw new Error(`Invalid content structure for section '${updatedSection}': ${(err as Error).message}`);
    }

    return { updatedSection, content };
  }

  static async refineStudyMaterial(
    notes: string,
    currentMaterial: StudyMaterial,
    refinementPrompt: string,
    signal?: AbortSignal
  ): Promise<RefinementResult> {
    const model = getGeminiModel();
    const prompt = `Original Study Notes:\n${notes}\n\nExisting Study Material (JSON):\n${JSON.stringify(
      currentMaterial,
      null,
      2
    )}\n\nUser Refinement Request:\n${refinementPrompt}`;

    try {
      return await this.executeRefinement(model, prompt, signal);
    } catch (error: unknown) {
      const isAbort = (error instanceof Error && error.name === "AbortError") || signal?.aborted;
      if (isAbort) {
        throw error;
      }

      const errMsg = error instanceof Error ? error.message : String(error);
      const errStatus = typeof error === "object" && error !== null && "status" in error
        ? (error as { status: unknown }).status
        : undefined;

      const currentModelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

      if (currentModelName !== "gemini-3.5-flash") {
        console.warn(`Primary model ${currentModelName} failed for refinement: ${errMsg}. Falling back to gemini-3.5-flash...`);
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
          });
          return await this.executeRefinement(fallbackModel, prompt, signal);
        } catch (fallbackError: unknown) {
          console.error("Fallback to gemini-3.5-flash failed for refinement:", fallbackError);
        }
      } else {
        console.warn(`Primary model gemini-3.5-flash failed for refinement: ${errMsg}. Falling back to gemini-3.1-flash-lite...`);
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite",
          });
          return await this.executeRefinement(fallbackModel, prompt, signal);
        } catch (fallbackError: unknown) {
          console.error("Fallback to gemini-3.1-flash-lite failed for refinement:", fallbackError);
        }
      }

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
