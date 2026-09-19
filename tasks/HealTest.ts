import fs from "fs";

import { GeminiClient } from "../config/GeminiClient";

export interface HealingResult {
  shouldHeal: boolean;
  reason: string;
  proposedChange: string;
  updatedTest: string;
}

export class HealTest {

  private readonly gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  async run(): Promise<HealingResult[]> {

    const failureAnalysis = fs.readFileSync(
      "test-results/failure-analysis.json",
      "utf-8"
    );

    const stepDefinitions = fs.readFileSync(
      "tests/step-definitions/activity-ranking.steps.ts",
      "utf-8"
    );

    const prompt = `
You are the Self-Healing Agent.

Review the failure analysis and the current step definitions.

Determine whether the failure is safe to automatically heal.

Rules:

1. Preserve the original test intent.
2. Never change acceptance criteria.
3. Never remove meaningful assertions.
4. Never hide a genuine application failure.
5. Only heal test implementation problems.
6. If the failure is caused by the application, environment,
   external dependency, or missing API, do NOT heal it.
7. If the failure is caused by an incorrect or missing test
   implementation, a small correction may be proposed.
8. Make the smallest reasonable change.
9. The healed test must be re-executed.

Return ONLY valid JSON using this structure:

[
  {
    "shouldHeal": false,
    "reason": "",
    "proposedChange": "",
    "updatedTest": ""
  }
]

Failure analysis:

${failureAnalysis}

Current step definitions:

${stepDefinitions}
`;

    const response = await this.gemini.generate(prompt);

    return this.gemini.parseJson<HealingResult[]>(response);
  }
}