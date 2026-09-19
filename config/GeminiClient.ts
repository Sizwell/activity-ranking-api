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
      throw new Error(
        "GEMINI_API_KEY is not configured"
      );
    }

    this.client = new GoogleGenAI({
      apiKey
    });
  }

  async generate(prompt: string): Promise<string> {

    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {

      try {

        const response = await this.client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });

        return response.text ?? "";

      } catch (error: any) {

        lastError = error;

        if (error?.status !== 429) {
          throw error;
        }

        if (attempt === this.maxRetries) {
          break;
        }

        console.log(
          `Gemini quota/rate limit reached. ` +
          `Retrying in ${this.retryDelayMs / 1000}s... ` +
          `(attempt ${attempt + 1}/${this.maxRetries})`
        );

        await this.delay(this.retryDelayMs);
      }
    }

    throw new Error(
      "Gemini API quota/rate limit still exceeded after retries. " +
      "The agent cannot continue until the Gemini quota becomes available."
    );
  }

  parseJson<T>(response: string): T {

    let cleaned = response.trim();

    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    return JSON.parse(cleaned) as T;
  }

  private delay(ms: number): Promise<void> {

    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}