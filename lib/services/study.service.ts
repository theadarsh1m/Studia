import { getGeminiModel } from "../ai/gemini";
import { STUDY_SYSTEM_PROMPT } from "../prompts/studyPrompt";
import { studyMaterialSchema } from "../validators/studySchema";
import { extractJson } from "../utils/extractJson";
import { StudyMaterial } from "../types/study";

export class StudyService {
  static async generateStudyMaterial(notes: string, signal?: AbortSignal): Promise<StudyMaterial> {
    const model = getGeminiModel();
    const prompt = `Study Notes:\n${notes}`;

    try {
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
    } catch (error: unknown) {
      const isAbort = (error instanceof Error && error.name === "AbortError") || signal?.aborted;
      if (isAbort) {
        throw error;
      }

      const errMsg = error instanceof Error ? error.message : String(error);
      const errStatus = typeof error === "object" && error !== null && "status" in error
        ? (error as { status: unknown }).status
        : undefined;

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
