import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, request, APIRequestContext, APIResponse } from '@playwright/test';

let apiContext: APIRequestContext;
let response: APIResponse;
let responseBody: any;
let simulateUpstreamError = false;

Before(async () => {
  apiContext = await request.newContext({
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  });
  simulateUpstreamError = false;
});

After(async () => {
  await apiContext.dispose();
});

Given('the Weather Planner API is available', async () => {
  const ping = await apiContext.get('/api/health').catch(() => null);
  // If health check endpoint is not configured, we accept normal routing presence
  if (ping) {
    expect(ping.status()).toBe(200);
  }
});

Given('the upstream Open-Meteo API is experiencing issues', async () => {
  simulateUpstreamError = true;
});

When('I request activity recommendations for city {string}', async (city: string) => {
  const headers: Record<string, string> = {};
  if (simulateUpstreamError) {
    headers['x-mock-upstream-error'] = 'true';
  }
  response = await apiContext.get('/api/activities', {
    params: { city },
    headers
  });
  responseBody = await response.json();
});

Then('the response status code should be {int}', async (statusCode: number) => {
  expect(response.status()).toBe(statusCode);
});

Then('the response should contain a {int}-day forecast', async (days: number) => {
  expect(responseBody.forecast).toBeDefined();
  expect(Array.isArray(responseBody.forecast)).toBe(true);
  expect(responseBody.forecast.length).toBe(days);
});

Then('each day should have {int} evaluated activities', async (activityCount: number) => {
  for (const day of responseBody.forecast) {
    expect(day.activities).toBeDefined();
    expect(day.activities.length).toBe(activityCount);
  }
});

Then('the activities should be ranked from highest to lowest suitability', async () => {
  for (const day of responseBody.forecast) {
    const suitabilities = day.activities.map((a: any) => a.suitability);
    const sortedSuitabilities = [...suitabilities].sort((a, b) => b - a);
    expect(suitabilities).toEqual(sortedSuitabilities);
  }
});

Then('the response should return a list of matching locations', async () => {
  expect(responseBody.matchingLocations).toBeDefined();
  expect(Array.isArray(responseBody.matchingLocations)).toBe(true);
  expect(responseBody.matchingLocations.length).toBeGreaterThan(0);
});

Then('each activity recommendation must contain {string}, {string}, {string}, and {string}', async (f1: string, f2: string, f3: string, f4: string) => {
  for (const day of responseBody.forecast) {
    expect(day[f1]).toBeDefined(); // Evaluates 'date'
    for (const act of day.activities) {
      expect(act[f2]).toBeDefined(); // Evaluates 'activity'
      expect(act[f3]).toBeDefined(); // Evaluates 'suitability'
      expect(act[f4]).toBeDefined(); // Evaluates 'reasoning'
    }
  }
});

Then('the response should contain an error message {string}', async (errorMessage: string) => {
  expect(responseBody.error).toBe(errorMessage);
});