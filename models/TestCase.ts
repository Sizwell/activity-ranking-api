export interface TestCase {
  id: string;
  title: string;
  description: string;
  feature: string;
  scenario: string;
  type: "positive" | "negative" | "edge";
  priority: "high" | "medium" | "low";
}