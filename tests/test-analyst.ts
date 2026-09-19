import { AnalyzeFeature } from "../tasks/AnalyzeFeature";

async function main() {

  const analyst = new AnalyzeFeature();

  const analysis = await analyst.run();

  console.log(
    JSON.stringify(analysis, null, 2)
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});