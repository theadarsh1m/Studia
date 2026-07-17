import { GoogleGenerativeAI } from "@google/generative-ai";
import dns from "dns";

if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is not defined in the environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable. Please configure it in .env.local");
  }
  // Use model name from env variable if provided, default to gemini-3.1-flash-lite for maximum compatibility
  const modelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  
  return genAI.getGenerativeModel({
    model: modelName,
  });
}
