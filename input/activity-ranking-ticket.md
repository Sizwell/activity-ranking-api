# Activity Ranking API – City-Based Weather Forecast Integration

## Feature

A user provides a city or town name and receives a ranked list of activities
for the next 7 days based on weather conditions.

Supported activities:

- Skiing
- Surfing
- Outdoor Sightseeing
- Indoor Sightseeing

## Acceptance Criteria

1. The API accepts a city or town name.

2. A partial city or town name is accepted and possible matches are returned.

3. The API retrieves 7-day weather data using Open-Meteo.

4. Each day is evaluated for weather suitability for each supported activity.

5. Activities are ranked according to weather suitability.

6. Each daily activity result contains:
   - Date
   - Activity name
   - Suitability measure
   - Reasoning

## Constraints

The system under test does not yet exist.

The API contract and assumptions about the Open-Meteo dependency
must be documented.

Tests should be written specification-first and are expected to fail
until the implementation exists.