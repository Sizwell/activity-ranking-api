export type Activity =
  | "Skiing"
  | "Surfing"
  | "Outdoor Sightseeing"
  | "Indoor Sightseeing";

export interface ActivityRanking {
  activity: Activity;
  suitability: number;
  reason: string;
}

export interface DailyRanking {
  date: string;
  activities: ActivityRanking[];
}

export interface ActivityRankingResponse {
  city: string;
  days: DailyRanking[];
}

export interface CityMatch {
  name: string;
  country: string;
}

export interface CityMatchResponse {
  matches: CityMatch[];
}

export interface WeatherDay {
  date: string;
  snowfall: number;
  precipitation: number;
  temperature: number;
  cloudCover: number;
}

export interface WeatherForecast {
  days: WeatherDay[];
}

export interface ErrorResponse {
  message: string;
}