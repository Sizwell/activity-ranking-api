import fs from "fs";

import { AnalyzeFailure } from "../tasks/AnalyzeFailure";

async function main() {

  console.log("Failure Analyzer Agent starting...");

  const analyzer = new AnalyzeFailure();

  const analysis = await analyzer.run();

  fs.writeFileSync(
    "test-results/failure-analysis.json",
    JSON.stringify(analysis, null, 2)
  );

  console.log(
    JSON.stringify(analysis, null, 2)
  );

  console.log("Failure analysis completed.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});