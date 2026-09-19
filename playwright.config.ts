import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080"
  }
});