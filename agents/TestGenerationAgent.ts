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

    const instructions = await fs.readFile(
      promptPath,
      "utf-8"
    );

    const request = `
Using the instructions below, generate additional
Gherkin scenarios for the Activity Ranking API.

The scenarios must complement the existing test suite.
Do not repeat the existing scenarios.

${instructions}
`;

    const response =
      await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: request
      });

    return response.text ?? "";
  }
}