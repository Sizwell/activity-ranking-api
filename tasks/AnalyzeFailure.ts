import fs from "fs";

import { GeminiClient } from "../config/GeminiClient";
import { TestFailure } from "../models/TestFailure";

export class AnalyzeFailure {

  private readonly gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  async run(): Promise<TestFailure[]> {

    const results = fs.readFileSync(
      "test-results/results.json",
      "utf-8"
    );

    const testResults = JSON.parse(results);

    const failures = testResults.filter(
      (result: any) => result.status === "failed"
    );

    if (failures.length === 0) {
      return [];
    }

    const prompt = `
You are the Failure Analyzer Agent.

Analyze the failed automated tests below.

Your responsibility is to determine the most likely cause
of each failure based only on the available evidence.

Possible failure categories include:

- Test logic
- Test data
- API response
- Environment
- External dependency
- Application behavior
- Undefined Cucumber step

Do not modify the test.

Do not invent evidence.

Clearly distinguish evidence from assumptions.

Return ONLY valid JSON using this structure:

[
  {
    "testId": "",
    "testTitle": "",
    "errorMessage": "",
    "analysis": "",
    "suggestedFix": ""
  }
]

Failed test results:

${JSON.stringify(failures, null, 2)}
`;

    const response = await this.gemini.generate(prompt);

    return this.gemini.parseJson<TestFailure[]>(response);
  }
}