import fs from "fs";

import { ExecuteTests } from "../tasks/ExecuteTests";

async function main() {

  console.log("Test Executor Agent starting...");

  const executor = new ExecuteTests();

  const results = await executor.run();

  fs.mkdirSync("test-results", {
    recursive: true
  });

  fs.writeFileSync(
    "test-results/results.json",
    JSON.stringify(results, null, 2)
  );

  console.log(
    JSON.stringify(results, null, 2)
  );

  console.log("Test execution completed.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});