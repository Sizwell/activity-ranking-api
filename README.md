# Activity Ranking API – Agentic AI SDET

An Agentic AI-powered API testing project for the **Activity Ranking API – City-Based Weather Forecast Integration** assessment.

The project uses **Gemini AI, TypeScript, Playwright API testing and Cucumber BDD** to analyse a feature ticket, generate tests, execute them, analyse failures and determine whether a safe test-healing action is possible.

---

## Architecture

```text
Feature Ticket
      │
      ▼
┌─────────────────────┐
│ Test Analyst Agent  │
└──────────┬──────────┘
           │
           ▼
   Test Analysis
           │
           ▼
┌─────────────────────┐
│ Test Generator Agent│
└──────────┬──────────┘
           │
           ▼
   Gherkin + TypeScript
           │
           ▼
┌─────────────────────┐
│ Test Executor Agent │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
    PASS       FAIL
      │         │
      ▼         ▼
   Results  Failure Analyzer
                    │
                    ▼
              Self-Healing
                    │
                    ▼
              Re-execution
```

---

## Technology Stack

* TypeScript
* Node.js
* Gemini API
* Playwright
* Playwright `APIRequestContext`
* Cucumber
* Gherkin
* npm
* dotenv

---

## Project Structure

```text
activity-ranking-api/
│
├── agents/
│   ├── test-analyst.md
│   ├── test-generator.md
│   ├── test-executor.md
│   ├── failure-analyzer.md
│   └── self-healing.md
│
├── config/
│   └── GeminiClient.ts
│
├── crew/
│   └── TestCrew.ts
│
├── input/
│   └── activity-ranking-ticket.md
│
├── models/
│   ├── TestAnalysis.ts
│   ├── TestCase.ts
│   ├── TestFailure.ts
│   ├── TestResult.ts
│   └── GeneratedTests.ts
│
├── skills/
│   ├── test-analysis/
│   ├── test-generation/
│   ├── test-execution/
│   ├── failure-analysis/
│   └── self-healing/
│
├── tasks/
│   ├── AnalyzeFeature.ts
│   ├── GenerateTests.ts
│   ├── ExecuteTests.ts
│   ├── AnalyzeFailure.ts
│   └── HealTest.ts
│
├── tests/
│   ├── features/
│   ├── step-definitions/
│   ├── api/
│   └── test-crew.ts
│
├── test-results/
│
├── playwright.config.ts
├── cucumber.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Feature

A user provides a city or town and receives activity rankings for the next seven days based on weather conditions.

Supported activities:

* Skiing
* Surfing
* Outdoor Sightseeing
* Indoor Sightseeing

The assessment requires specification-first testing because the system under test does not yet exist. Tests are therefore expected to represent the intended behaviour before implementation.

---

## BDD Coverage

The BDD scenarios cover the requirements supplied by the feature ticket, including:

* City/town input
* Partial city/town matching
* Seven-day weather data
* Activity suitability
* Activity ranking
* Daily activity results
* Suitability measurement
* Reasoning

The generated Gherkin is stored in:

```text
tests/features/activity-ranking.feature
```

---

## API Contract Assumption

Because the API implementation does not yet exist, this project defines an assumed contract for testing.

### Request

```http
GET /api/activity-ranking?city=Cape%20Town
```

### Example response

```json
{
  "city": "Cape Town",
  "days": [
    {
      "date": "2026-09-20",
      "activities": [
        {
          "activity": "Outdoor Sightseeing",
          "suitability": 0.92,
          "reasoning": "Mild temperature and low precipitation."
        },
        {
          "activity": "Surfing",
          "suitability": 0.81,
          "reasoning": "Suitable temperature and favourable conditions."
        }
      ]
    }
  ]
}
```

This response structure is a **testing assumption**, not an API contract supplied by the assessment.

The actual implementation may use a different representation.

---

## External Dependency

The feature requires seven-day weather data from **Open-Meteo**.

The assessment identifies Open-Meteo as the weather-data dependency but does not provide the complete integration contract.

The tests therefore treat the external weather service as a dependency rather than implementing it.

---

## Specification-First Approach

The API implementation is intentionally absent.

The testing flow is:

```text
Requirement
     ↓
Test Analysis
     ↓
BDD Specification
     ↓
Automated Test
     ↓
Execution
     ↓
Failure Analysis
```

A failing test does not automatically indicate that the test is incorrect. Since the application does not exist, a meaningful red state is expected. This follows the assessment's specification-first requirement.

---

## Agent Responsibilities

### Test Analyst Agent

Analyses the feature ticket and identifies:

* Requirements
* Acceptance criteria
* Test scenarios
* Risks
* Test data
* External dependencies

It does not generate executable tests.

### Test Generator Agent

Converts the analysis into:

* Gherkin feature files
* Cucumber step definitions
* Playwright API tests

### Test Executor Agent

Runs the automated tests and captures:

* Pass/fail status
* Execution duration
* Test output
* Error information

### Failure Analyzer Agent

Analyses failures and categorises likely causes such as:

* Test logic
* Test data
* API response
* Environment
* External dependency
* Application behaviour
* Undefined Cucumber steps

### Self-Healing Agent

Determines whether a failure can safely be corrected automatically.

The agent must:

* Preserve test intent
* Preserve acceptance criteria
* Preserve meaningful assertions
* Avoid hiding genuine application failures
* Make the smallest reasonable change

---

## Running the Project

### Install dependencies

```bash
npm install
```

### Configure Gemini

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
BASE_URL=http://localhost:8080
```

### Run BDD tests

```bash
npm run test:bdd
```

### Run individual agents

```bash
npm run test:analyst
npm run test:generator
npm run test:executor
npm run test:failure-analysis
npm run test:heal
```

### Run the complete Agentic AI crew

```bash
npm run test:crew
```

---

## Expected State

Because the application under test has not been implemented, failures are expected.

The important result is that the framework can:

1. Analyse the specification.
2. Generate tests.
3. Execute the tests.
4. Capture failures.
5. Analyse the failures.
6. Determine whether self-healing is appropriate.

---

## Omissions and Trade-offs

### API implementation

The API itself is not implemented because the assessment asks for tests against a specification-first feature.

### Weather service

Open-Meteo is treated as an external dependency rather than being recreated inside the test project.

### API contract

The request and response structure is an explicit testing assumption because the assessment does not provide a complete API schema.

### Suitability algorithm

The exact algorithm for determining weather suitability is not defined by the feature ticket. Tests therefore validate the presence and structure of suitability and reasoning rather than asserting an invented scoring algorithm.

### Self-healing

Self-healing is intentionally restricted to test implementation problems. The agent should not modify tests to make genuine application failures pass.

### AI-generated tests

Generated tests are reviewed through the agent workflow but should still be treated as generated artefacts that require human review before being used in a production test suite.

---

## AI Usage

Gemini is used as the reasoning engine for the agent workflow.

The AI is responsible for:

* Analysing requirements
* Generating test specifications
* Generating automation
* Analysing failures
* Proposing safe test corrections

TypeScript remains responsible for deterministic orchestration and execution.

This separation keeps AI reasoning separate from the actual test execution layer.

---

## Final Demonstration

Run:

```bash
npm run test:crew
```

The expected flow is:

```text
=== TEST CREW STARTED ===

1. Test Analyst Agent
Feature analysis completed.

2. Test Generator Agent
Tests generated.

3. Test Executor Agent
Test execution completed.

4. Failure Analyzer Agent
Failures analysed.

5. Self-Healing Agent
Self-healing analysis completed.

=== TEST CREW FINISHED ===
```

The resulting artefacts are stored under:

```text
test-results/
```

---

## Assessment Deliverables

The repository contains:

* BDD feature files
* Automated TypeScript tests
* Cucumber step definitions
* Agent definitions
* Agent skills
* Agent orchestration
* Failure analysis
* Self-healing logic
* README
* API contract assumptions
* Testing trade-offs

The project is designed to demonstrate specification-first thinking, realistic API testing and practical use of AI within an SDET workflow.
