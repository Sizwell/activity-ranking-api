import fs from "fs";

import { AnalyzeFeature } from "../tasks/AnalyzeFeature";
import { GenerateTests } from "../tasks/GenerateTests";

async function main() {

  const analyst = new AnalyzeFeature();

  const analysis = await analyst.run();

  const generator = new GenerateTests();

  const generatedTests = await generator.run(
    analysis
  );

  fs.mkdirSync("tests/step-definitions", {
    recursive: true
  });

  fs.mkdirSync("tests/api", {
    recursive: true
  });

  fs.writeFileSync(
    "tests/step-definitions/activity-ranking.steps.ts",
    generatedTests.stepDefinitions
  );

  fs.writeFileSync(
    "tests/api/activity-ranking.spec.ts",
    generatedTests.apiTests
  );

  console.log("Tests generated successfully.");
}

main().catch(error => {

  console.error(error);

  process.exit(1);
});