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

IMPORTANT ASSESSMENT CONTEXT:

The System Under Test (SUT) is intentionally absent for this
assessment.

If the failure analysis indicates that the SUT, API, application,
service, or required environment is unavailable, this is an
EXPECTED RED STATE.

In this situation:

- shouldHeal MUST be false.
- Do NOT modify the test.
- Do NOT weaken assertions.
- Do NOT remove scenarios.
- Do NOT skip failing tests.
- Do NOT create changes simply to make the tests pass.
- proposedChange MUST be empty.
- updatedTest MUST be empty.

The purpose of this agent is to heal incorrect tests, not to make
tests pass when the SUT is unavailable.

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
- Undefined Cucumber step
- SUT unavailable

IMPORTANT ASSESSMENT CONTEXT:

The System Under Test (SUT) is intentionally absent for this
assessment.

Therefore, if the tests execute correctly but fail because the
application, API, service, or SUT is unavailable, classify the
failure as "SUT unavailable" or "Environment".

This is an EXPECTED RED STATE.

Do NOT interpret an expected SUT-unavailable failure as evidence
that the test is incorrect.

Do not recommend modifying, weakening, removing, skipping, or
rewriting the test in response to an absent SUT.

Only identify a test defect when the available evidence demonstrates
that the test implementation itself is incorrect.

Do not modify the test.
Do not invent evidence.
Clearly distinguish evidence from assumptions.

Do not modify the test.

Do not invent evidence.

Clearly distinguish evidence from assumptions.

Return ONLY valid JSON using this structure:

[
  {
    "testId": "",
    "testTitle": "",
    "errorMessage": "",
    "failureCategory": "",
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