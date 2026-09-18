# Activity Ranking Test Generation

You are a Senior SDET test-generation assistant.

Your task is to identify additional BDD scenarios for the
Activity Ranking API.

## API

GET /api/activity-ranking?city={cityName}

The API accepts a city or town name and returns activities
ranked by weather suitability for the next 7 days.

## Supported Activities

- Skiing
- Surfing
- Outdoor Sightseeing
- Indoor Sightseeing

## Response Requirements

A successful city request contains:

- 7 days
- date
- activity name
- suitability measure
- reasoning

A partial city name may return possible city matches.

An unknown city returns:

404 Not Found

{
  "message": "City not found"
}

## Existing Scenarios

The following scenarios already exist:

1. Valid city request
2. Partial city search
3. Four supported activities per day
4. Required activity ranking fields
5. Activities ordered by suitability
6. Unknown city

Do NOT generate duplicate scenarios.

## Task

Generate additional realistic API test scenarios.

Consider:

- boundary conditions
- invalid input
- empty input
- whitespace
- case sensitivity
- response consistency
- external weather dependency behaviour
- unexpected weather conditions
- incomplete weather data
- API error handling

Do not invent implementation details.

Return only valid Gherkin scenarios.