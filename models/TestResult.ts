export interface TestResult {
  testId: string;
  title: string;
  status: "passed" | "failed";
  durationMs: number;
  output?: string;
  error?: string;
}
