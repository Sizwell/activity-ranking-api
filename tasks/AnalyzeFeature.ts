import fs from "fs";
import path from "path";

import { GeminiClient } from "../config/GeminiClient";
import { TestAnalysis } from "../models/TestAnalysis";

export class AnalyzeFeature {

  private readonly gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  async run(): Promise<TestAnalysis> {

    const featurePath = path.join(
      process.cwd(),
      "input",
      "activity-ranking-ticket.md"
    );

    const featureTicket = fs.readFileSync(
      featurePath,
      "utf-8"
    );

    const prompt = `
You are a Senior Test Analyst Agent.

Analyze the following feature ticket.

Your job is to identify what needs to be tested.

Do not generate Gherkin.
Do not generate TypeScript.
Do not invent requirements that are not supported by the ticket.

Return ONLY valid JSON using this exact structure:

{
  "requirements": [],
  "acceptanceCriteria": [],
  "scenarios": [],
  "risks": [],
  "testDataRequirements": [],
  "externalDependencies": []
}

Feature ticket:

${featureTicket}
`;

    const response = await this.gemini.generate(prompt);

    return this.gemini.parseJson<TestAnalysis>(response);
  }
}