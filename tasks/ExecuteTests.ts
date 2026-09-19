import { exec } from "child_process";
import { promisify } from "util";

import { TestResult } from "../models/TestResult";

const execAsync = promisify(exec);

export class ExecuteTests {

  async run(): Promise<TestResult[]> {

    const startTime = Date.now();

    try {

      const result = await execAsync(
        "npx cucumber-js --format progress",
        {
          maxBuffer: 10 * 1024 * 1024
        }
      );

      return [
        {
          testId: "activity-ranking",
          title: "Activity Ranking API BDD tests",
          status: "passed",
          durationMs: Date.now() - startTime,
          output: result.stdout
        }
      ];

    } catch (error: any) {

      return [
        {
          testId: "activity-ranking",
          title: "Activity Ranking API BDD tests",
          status: "failed",
          durationMs: Date.now() - startTime,
          output: error.stdout,
          error: error.stderr || error.message
        }
      ];
    }
  }
}