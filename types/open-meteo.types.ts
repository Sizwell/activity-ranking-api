export interface OpenMeteoDailyResponse {
  time: string[];
  temperature_2m_max: number[];
  precipitation_sum: number[];
  snowfall_sum: number[];
  cloudcover_mean: number[];
}

export interface OpenMeteoForecastResponse {
  daily: OpenMeteoDailyResponse;
}