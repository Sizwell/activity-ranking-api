import { GeminiClient } from "../config/GeminiClient";

async function main() {

  const gemini = new GeminiClient();

  const response = await gemini.generate(
    "Respond with exactly: Gemini connection successful"
  );

  console.log(response);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
