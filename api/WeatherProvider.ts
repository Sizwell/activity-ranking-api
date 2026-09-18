import { WeatherForecast } from "../types/activity-ranking.types";

export interface WeatherProvider {
  getSevenDayForecast(
    latitude: number,
    longitude: number
  ): Promise<WeatherForecast>;
}
