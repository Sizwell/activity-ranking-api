export interface TestFailure {
  testId: string;
  testTitle: string;
  errorMessage: string;
  stackTrace?: string;
  analysis?: string;
  suggestedFix?: string;
}