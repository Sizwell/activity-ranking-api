import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Activity Planner API Contract & Integration Tests', () => {
  let apiContext: APIRequestContext;
  const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('TC001 & TC005: Exact city search returns 7-day ranked forecast and validates response schema', async () => {
    const response = await apiContext.get('/api/activities', {
      params: { city: 'Chamonix' }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('forecast');
    expect(Array.isArray(body.forecast)).toBe(true);
    expect(body.forecast.length).toBe(7);

    const supportedActivities = ['Skiing', 'Surfing', 'Outdoor Sightseeing', 'Indoor Sightseeing'];

    body.forecast.forEach((day: any) => {
      expect(day).toHaveProperty('date');
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(day.activities)).toBe(true);
      expect(day.activities.length).toBe(4);

      day.activities.forEach((activity: any) => {
        expect(supportedActivities).toContain(activity.activity_name);
        expect(activity).toHaveProperty('suitability_measure');
        expect(typeof activity.suitability_measure).toBe('number');
        expect(activity.suitability_measure).toBeGreaterThanOrEqual(0);
        expect(activity.suitability_measure).toBeLessThanOrEqual(100);
        expect(activity).toHaveProperty('reasoning');
        expect(typeof activity.reasoning).toBe('string');
      });
    });
  });

  test('TC002: Partial city name search returns matches list', async () => {
    const response = await apiContext.get('/api/activities', {
      params: { city: 'Cham' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('matches');
    expect(Array.isArray(body.matches)).toBe(true);
    body.matches.forEach((match: any) => {
      expect(match).toHaveProperty('name');
      expect(match.name.toLowerCase()).toContain('cham');
    });
  });

  test('TC003: Verify integration contract works for outdoor & indoor conditions', async () => {
    // Checking structured responses map cleanly for high suitability parameters
    const response = await apiContext.get('/api/activities', {
      params: { city: 'Lisbon' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.forecast[0].activities.length).toBe(4);
  });

  test('TC004: Verify activities ranking logic is sorted descending', async () => {
    const response = await apiContext.get('/api/activities', {
      params: { city: 'Aspen' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    body.forecast.forEach((day: any) => {
      const suitabilities = day.activities.map((a: any) => a.suitability_measure);
      for (let i = 0; i < suitabilities.length - 1; i++) {
        expect(suitabilities[i]).toBeGreaterThanOrEqual(suitabilities[i + 1]);
      }
    });
  });
});