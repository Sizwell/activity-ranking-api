import { TestCrew } from "../crew/TestCrew";

async function main() {

  const crew = new TestCrew();

  await crew.run();
}

main().catch(error => {

  console.error(error);

  process.exit(1);
});