import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export class GeminiClient {
  private readonly client: GoogleGenAI;

  private readonly maxRetries = 2;
  private readonly retryDelayMs = 8000;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async generate(prompt: string): Promise<string> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        return response.text ?? "";
      } catch (error: any) {
        lastError = error;

        const status = error?.status;

        const retryable =
          status === 429 ||
          status === 500 ||
          status === 502 ||
          status === 503;

        if (!retryable) {
          throw error;
        }

        if (attempt === this.maxRetries) {
          break;
        }

        console.log(
          `Gemini request failed with status ${status}. ` +
          `Retrying in ${this.retryDelayMs / 1000}s... ` +
          `(attempt ${attempt + 1}/${this.maxRetries})`
        );

        await this.delay(this.retryDelayMs);
      }
    }

    throw new Error(
      `Gemini request failed after ${this.maxRetries} retries. ` +
      `Last error: ${String(lastError)}`
    );
  }

  parseJson<T>(response: string): T {
    let cleaned = response.trim();

    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      throw new Error(
        `Gemini returned invalid JSON.\n\nResponse:\n${response}`
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}