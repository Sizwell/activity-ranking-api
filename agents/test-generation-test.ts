import { TestGenerationAgent } from "./TestGenerationAgent";

async function main() {

  const agent = new TestGenerationAgent();

  const scenarios =
    await agent.generateScenarios();

  console.log("\nGenerated Gherkin:\n");
  console.log(scenarios);
}

main().catch(error => {
  console.error("AI generation failed:");
  console.error(error);
  process.exit(1);
});
