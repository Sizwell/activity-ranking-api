import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";

dotenv.config();

export class TestGenerationAgent {

  private readonly ai: GoogleGenAI;

  constructor() {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured"
      );
    }

    this.ai = new GoogleGenAI({
      apiKey
    });
  }

  async generateScenarios(): Promise<string> {

    const promptPath = path.join(
      process.cwd(),
      "agents",
      "prompts",
      "test-generation.md"
    );

    const prompt = await fs.readFile(
      promptPath,
      "utf-8"
    );

    const response = await this.ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    return response.text ?? "";
  }
}