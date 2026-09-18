export const testCities = {
  validCity: "Cape Town",
  partialCity: "Cape",
  unknownCity: "Atlantis123"
};

export const expectedActivities = [
  "Skiing",
  "Surfing",
  "Outdoor Sightseeing",
  "Indoor Sightseeing"
] as const;

export const mockWeatherData = {
  days: [
    {
      date: "2026-09-18",
      snowfall: 10,
      precipitation: 0,
      temperature: 2,
      cloudCover: 20
    },
    {
      date: "2026-09-19",
      snowfall: 0,
      precipitation: 0,
      temperature: 22,
      cloudCover: 10
    },
    {
      date: "2026-09-20",
      snowfall: 0,
      precipitation: 5,
      temperature: 18,
      cloudCover: 30
    },
    {
      date: "2026-09-21",
      snowfall: 0,
      precipitation: 80,
      temperature: 15,
      cloudCover: 90
    },
    {
      date: "2026-09-22",
      snowfall: 0,
      precipitation: 10,
      temperature: 20,
      cloudCover: 20
    },
    {
      date: "2026-09-23",
      snowfall: 0,
      precipitation: 0,
      temperature: 24,
      cloudCover: 5
    },
    {
      date: "2026-09-24",
      snowfall: 0,
      precipitation: 30,
      temperature: 17,
      cloudCover: 60
    }
  ]
};
