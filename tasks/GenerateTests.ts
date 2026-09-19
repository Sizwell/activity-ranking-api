import { GeminiClient } from "../config/GeminiClient";
import { TestAnalysis } from "../models/TestAnalysis";
import { GeneratedTests } from "../models/GeneratedTests";

export class GenerateTests {

  private readonly gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  async run(
    analysis: TestAnalysis
  ): Promise<GeneratedTests> {

    const prompt = `
You are the Test Generator Agent.

Generate BDD and automated API tests from the supplied test analysis.

Technology:

- Gherkin
- Cucumber
- TypeScript
- Playwright
- Playwright APIRequestContext

IMPORTANT:

The generated feature file and step definitions MUST be created
together.

Every executable Given, When, Then, And, or But statement in the
feature file MUST have a matching Cucumber step definition.

Do not generate a Gherkin step unless a corresponding step
definition is also generated.

Use Cucumber Expressions such as:

{string}
{int}

where appropriate.

The wording of the generated Gherkin steps must match the
Cucumber step definitions.

Requirements:

1. Generate valid Gherkin.
2. Generate matching TypeScript Cucumber step definitions.
3. Generate Playwright API tests.
4. Use Playwright APIRequestContext for HTTP calls.
5. Do not implement the API itself.
6. Do not invent requirements.
7. Include positive, negative and edge scenarios where supported.
8. Keep the tests readable.
9. Reuse step definitions where possible.
10. Make the generated feature and step-definition files internally
    consistent.

Before returning the response, perform this validation:

- Extract every Given, When, Then, And and But statement from the
  feature file.
- Verify that every statement has a matching step definition.
- If any step is missing, generate the missing definition.
- Do not return the response until every step has a definition.

Return ONLY valid JSON using this exact structure:

{
  "featureFile": "...",
  "stepDefinitions": "...",
  "apiTests": "..."
}

Test analysis:

${JSON.stringify(analysis, null, 2)}
`;

    const response = await this.gemini.generate(prompt);

    return this.gemini.parseJson<GeneratedTests>(response);
  }
}