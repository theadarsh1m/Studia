import { NextRequest, NextResponse } from "next/server";
import { StudyService } from "@/lib/services/study.service";

export async function POST(request: NextRequest) {
  try {
    // 1. Check API Key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    // 2. Parse request body
    let body: { notes?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { notes } = body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'notes' field in request body." },
        { status: 400 }
      );
    }

    // 3. Call service layer
    const data = await StudyService.generateStudyMaterial(notes);

    // 4. Return success response
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("API error in /api/study/generate:", err);

    // Rate limit handling
    if (err.message?.includes("Rate limit exceeded")) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 429 }
      );
    }

    // Zod validation error or malformed JSON from service
    if (err.message?.includes("AI generated invalid output structure") || err.message?.includes("Failed to parse")) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: err.message || "An unexpected error occurred while generating study materials." },
      { status: 500 }
    );
  }
}
