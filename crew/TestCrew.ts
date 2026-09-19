import { AnalyzeFeature } from "../tasks/AnalyzeFeature";
import { GenerateTests } from "../tasks/GenerateTests";
import { ExecuteTests } from "../tasks/ExecuteTests";
import { AnalyzeFailure } from "../tasks/AnalyzeFailure";
import { HealTest } from "../tasks/HealTest";

export class TestCrew {

  private readonly analyst = new AnalyzeFeature();
  private readonly generator = new GenerateTests();
  private readonly executor = new ExecuteTests();
  private readonly failureAnalyzer = new AnalyzeFailure();
  private readonly healer = new HealTest();

  async run(): Promise<void> {

    console.log("\n=== TEST CREW STARTED ===\n");

    // 1. Analyse feature
    console.log("1. Test Analyst Agent");
    const analysis = await this.analyst.run();

    console.log("Feature analysis completed.\n");

    // 2. Generate tests
    console.log("2. Test Generator Agent");
    const generatedTests = await this.generator.run(analysis);

    console.log("Tests generated.\n");

    // 3. Execute tests
    console.log("3. Test Executor Agent");
    const results = await this.executor.run();

    console.log("Test execution completed.\n");

    const hasFailures = results.some(
      result => result.status === "failed"
    );

    if (!hasFailures) {
      console.log("All tests passed.");
      return;
    }

    // 4. Analyse failures
    console.log("4. Failure Analyzer Agent");

    const failures = await this.failureAnalyzer.run();

    console.log(
      `${failures.length} failure(s) analysed.\n`
    );

    // 5. Attempt self-healing
    console.log("5. Self-Healing Agent");

    const healingResults = await this.healer.run();

    console.log("Self-healing analysis completed.\n");

    console.log("=== TEST CREW FINISHED ===\n");

    console.log(
      JSON.stringify(
        {
          analysis,
          generatedTests,
          results,
          failures,
          healingResults
        },
        null,
        2
      )
    );
  }
}