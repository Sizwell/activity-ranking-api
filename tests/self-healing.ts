import fs from "fs";

import { HealTest } from "../tasks/HealTest";

async function main() {

  console.log("Self-Healing Agent starting...");

  const healer = new HealTest();

  const result = await healer.run();

  fs.writeFileSync(
    "test-results/healing-result.json",
    JSON.stringify(result, null, 2)
  );

  console.log(
    JSON.stringify(result, null, 2)
  );

  console.log("Self-Healing analysis completed.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});