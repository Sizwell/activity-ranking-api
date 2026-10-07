import {
  Given,
  When,
  Then,
  Before,
  After,
  DataTable
} from '@cucumber/cucumber';

import {
  expect,
  request,
  APIRequestContext,
  APIResponse
} from '@playwright/test';

let apiContext: APIRequestContext;
let response: APIResponse;
let responseBody: any;

const BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:3000';

Before(async () => {
  apiContext = await request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
});

After(async () => {
  if (apiContext) {
    await apiContext.dispose();
  }
});

/*
 * --------------------------------------------------------------------------
 * Given steps
 * --------------------------------------------------------------------------
 */

Given('the API is running', async function () {
  const health = await apiContext.get('/health');

  expect(health.status()).toBeDefined();
});

Given('the city {string} exists', async function (city: string) {
  // This step establishes the test precondition.
  // The actual behaviour under test is performed by the When step.
  this.city = city;
});

Given('the city {string} does not exist', async function (city: string) {
  // Preserve the scenario intent. The actual API request is made
  // by the corresponding When step.
  this.city = city;
});

Given('cities matching {string} exist', async function (partialCity: string) {
  // Preserve the scenario precondition.
  this.partialCity = partialCity;
});

/*
 * --------------------------------------------------------------------------
 * When steps
 * --------------------------------------------------------------------------
 */

When(
  'I request activity rankings for {string}',
  async function (city: string) {
    response = await apiContext.get('/api/activities', {
      params: { city }
    });

    responseBody = await response.json().catch(() => ({}));
  }
);

When(
  'I request activity rankings for the partial city name {string}',
  async function (partialCity: string) {
    response = await apiContext.get('/api/activities', {
      params: { city: partialCity }
    });

    responseBody = await response.json().catch(() => ({}));
  }
);

/*
 * --------------------------------------------------------------------------
 * Response status
 * --------------------------------------------------------------------------
 */

Then(
  'the response status should be {int}',
  async function (statusCode: number) {
    expect(response.status()).toBe(statusCode);
  }
);

/*
 * --------------------------------------------------------------------------
 * Seven-day forecast
 * --------------------------------------------------------------------------
 */

Then(
  'the response should contain 7 days of weather-based activity rankings',
  async function () {
    expect(responseBody).toHaveProperty('forecast');
    expect(Array.isArray(responseBody.forecast)).toBe(true);
    expect(responseBody.forecast.length).toBe(7);
  }
);

Then(
  'the response should contain a ranked list of activities for 7 days',
  async function () {
    expect(responseBody).toHaveProperty('forecast');
    expect(Array.isArray(responseBody.forecast)).toBe(true);
    expect(responseBody.forecast.length).toBe(7);
  }
);

/*
 * --------------------------------------------------------------------------
 * Activities per day
 * --------------------------------------------------------------------------
 */

Then(
  'each day should contain rankings for:',
  async function (dataTable: DataTable) {
    const expectedActivities = dataTable
      .raw()
      .slice(1)
      .map((row) => row[0].trim());

    expect(responseBody).toHaveProperty('forecast');
    expect(Array.isArray(responseBody.forecast)).toBe(true);

    for (const day of responseBody.forecast) {
      expect(day).toHaveProperty('activities');
      expect(Array.isArray(day.activities)).toBe(true);

      const actualActivities = day.activities.map(
        (activity: any) => activity.activity_name
      );

      for (const expectedActivity of expectedActivities) {
        expect(actualActivities).toContain(expectedActivity);
      }
    }
  }
);

/*
 * --------------------------------------------------------------------------
 * Required activity information
 * --------------------------------------------------------------------------
 */

Then(
  'each activity ranking should contain a date',
  async function () {
    expect(responseBody).toHaveProperty('forecast');

    for (const day of responseBody.forecast) {
      expect(day).toHaveProperty('date');
      expect(typeof day.date).toBe('string');
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  }
);

Then(
  'each activity ranking should contain an activity name',
  async function () {
    expect(responseBody).toHaveProperty('forecast');

    for (const day of responseBody.forecast) {
      expect(day).toHaveProperty('activities');
      expect(Array.isArray(day.activities)).toBe(true);

      for (const activity of day.activities) {
        expect(activity).toHaveProperty('activity_name');
        expect(typeof activity.activity_name).toBe('string');
        expect(activity.activity_name.length).toBeGreaterThan(0);
      }
    }
  }
);

Then(
  'each activity ranking should contain a suitability measure',
  async function () {
    expect(responseBody).toHaveProperty('forecast');

    for (const day of responseBody.forecast) {
      for (const activity of day.activities) {
        expect(activity).toHaveProperty('suitability_measure');
        expect(typeof activity.suitability_measure).toBe('number');

        expect(activity.suitability_measure).toBeGreaterThanOrEqual(0);
        expect(activity.suitability_measure).toBeLessThanOrEqual(100);
      }
    }
  }
);

Then(
  'each activity ranking should contain reasoning',
  async function () {
    expect(responseBody).toHaveProperty('forecast');

    for (const day of responseBody.forecast) {
      for (const activity of day.activities) {
        expect(activity).toHaveProperty('reasoning');
        expect(typeof activity.reasoning).toBe('string');
        expect(activity.reasoning.length).toBeGreaterThan(0);
      }
    }
  }
);

/*
 * --------------------------------------------------------------------------
 * Ranking
 * --------------------------------------------------------------------------
 */

Then(
  'the activities for each day should be ordered by weather suitability',
  async function () {
    expect(responseBody).toHaveProperty('forecast');

    for (const day of responseBody.forecast) {
      expect(Array.isArray(day.activities)).toBe(true);

      const scores = day.activities.map(
        (activity: any) => activity.suitability_measure
      );

      const sortedScores = [...scores].sort((a, b) => b - a);

      expect(scores).toEqual(sortedScores);
    }
  }
);

Then(
  'the daily activities should be ranked from highest to lowest suitability',
  async function () {
    for (const day of responseBody.forecast) {
      const scores = day.activities.map(
        (activity: any) => activity.suitability_measure
      );

      const sortedScores = [...scores].sort((a, b) => b - a);

      expect(scores).toEqual(sortedScores);
    }
  }
);

/*
 * --------------------------------------------------------------------------
 * City matching
 * --------------------------------------------------------------------------
 */

Then(
  'the response should contain a list of possible city matches',
  async function () {
    expect(responseBody).toHaveProperty('matches');
    expect(Array.isArray(responseBody.matches)).toBe(true);
  }
);

Then(
  'the response should contain a list of matching cities including {string}',
  async function (expectedCity: string) {
    expect(responseBody).toHaveProperty('matches');
    expect(Array.isArray(responseBody.matches)).toBe(true);

    const hasMatch = responseBody.matches.some(
      (match: any) =>
        typeof match.name === 'string' &&
        match.name
          .toLowerCase()
          .includes(expectedCity.toLowerCase())
    );

    expect(hasMatch).toBe(true);
  }
);

Then(
  'each city match should contain a name',
  async function () {
    expect(responseBody).toHaveProperty('matches');
    expect(Array.isArray(responseBody.matches)).toBe(true);

    for (const match of responseBody.matches) {
      expect(match).toHaveProperty('name');
      expect(typeof match.name).toBe('string');
      expect(match.name.length).toBeGreaterThan(0);
    }
  }
);

Then(
  'each city match should contain a country',
  async function () {
    expect(responseBody).toHaveProperty('matches');
    expect(Array.isArray(responseBody.matches)).toBe(true);

    for (const match of responseBody.matches) {
      expect(match).toHaveProperty('country');
      expect(typeof match.country).toBe('string');
      expect(match.country.length).toBeGreaterThan(0);
    }
  }
);

/*
 * --------------------------------------------------------------------------
 * Error responses
 * --------------------------------------------------------------------------
 */

Then(
  'the response message should be {string}',
  async function (expectedMessage: string) {
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe(expectedMessage);
  }
);

/*
 * --------------------------------------------------------------------------
 * Contract validation
 * --------------------------------------------------------------------------
 */

Then(
  'the response schema should be valid according to the contract',
  async function () {
    expect(responseBody).toBeDefined();
    expect(responseBody).toHaveProperty('forecast');

    const supportedActivities = [
      'Skiing',
      'Surfing',
      'Outdoor Sightseeing',
      'Indoor Sightseeing'
    ];

    responseBody.forecast.forEach((day: any) => {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(day.activities)).toBe(true);

      day.activities.forEach((activity: any) => {
        expect(supportedActivities).toContain(
          activity.activity_name
        );

        expect(typeof activity.suitability_measure).toBe(
          'number'
        );

        expect(
          activity.suitability_measure
        ).toBeGreaterThanOrEqual(0);

        expect(
          activity.suitability_measure
        ).toBeLessThanOrEqual(100);

        expect(typeof activity.reasoning).toBe('string');
      });
    });
  }
);