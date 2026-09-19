import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Weather-based Activity Planner API Tests', () => {

  test('should retrieve 7-day forecast and ranked activities for a valid city', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/activities`, {
      params: { city: 'Paris' }
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.forecast).toBeDefined();
    expect(body.forecast.length).toBe(7);

    for (const day of body.forecast) {
      expect(day.date).toBeDefined();
      expect(day.activities).toBeDefined();
      expect(day.activities.length).toBe(4);

      // Validate that all expected activities are returned
      const activityNames = day.activities.map((a: any) => a.activity);
      expect(activityNames).toContain('Skiing');
      expect(activityNames).toContain('Surfing');
      expect(activityNames).toContain('Outdoor Sightseeing');
      expect(activityNames).toContain('Indoor Sightseeing');

      // Validate that each recommendation contains the mandatory structure
      for (const activity of day.activities) {
        expect(activity.suitability).toBeDefined();
        expect(typeof activity.suitability).toBe('number');
        expect(activity.reasoning).toBeDefined();
        expect(typeof activity.reasoning).toBe('string');
      }

      // Verify suitability ranking: highest score to lowest score
      const suitabilities = day.activities.map((a: any) => a.suitability);
      const sortedSuitabilities = [...suitabilities].sort((a, b) => b - a);
      expect(suitabilities).toEqual(sortedSuitabilities);
    }
  });

  test('should return a list of matching locations when a partial query is provided', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/activities`, {
      params: { city: 'Lon' }
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.matchingLocations).toBeDefined();
    expect(Array.isArray(body.matchingLocations)).toBe(true);
    expect(body.matchingLocations.length).toBeGreaterThan(0);
    
    for (const location of body.matchingLocations) {
      expect(location.name).toBeDefined();
      expect(location.name.toLowerCase()).toContain('lon');
    }
  });

  test('should return a 502 Bad Gateway response when the upstream Open-Meteo API fails', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/activities`, {
      params: { city: 'Paris' },
      headers: {
        'x-mock-upstream-error': 'true'
      }
    });
    expect(response.status()).toBe(502);

    const body = await response.json();
    expect(body.error).toBe('Upstream weather service unavailable');
  });
});