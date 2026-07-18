import { NextResponse } from "next/server";
import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPE } from "@/lib/fileValidation";

// Polyfill DOMMatrix for pdf-parse in Node.js 18+ environments
if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}

const pdfParse = require("pdf-parse");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== ALLOWED_MIME_TYPE) {
      return NextResponse.json({ error: "Invalid file type. Only PDF is allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds the 15MB limit." }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    // Convert the File object to a Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from the PDF using pdf-parse v2.4.5
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    
    const extractedText = data.text?.trim() || "";
    
    if (!extractedText) {
      return NextResponse.json({ error: "Could not extract text from this PDF. It may be an image-based or protected PDF." }, { status: 422 });
    }

    return NextResponse.json({ text: extractedText }, { status: 200 });
  } catch (error: any) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: `Failed to extract PDF: ${error.message || String(error)}` },
      { status: 500 }
    );
  }
}
