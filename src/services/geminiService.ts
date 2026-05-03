import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment.");
}

export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  CHAT: "gemini-3-flash-preview",
  LIVE: "gemini-3.1-flash-live-preview",
};
