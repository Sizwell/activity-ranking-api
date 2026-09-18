import { WeatherForecast } from "../types/activity-ranking.types";
import { mockWeatherData } from "../test-data/test-data";
import { WeatherProvider } from "./WeatherProvider";

export class MockWeatherProvider implements WeatherProvider {

  async getSevenDayForecast(
    latitude: number,
    longitude: number
  ): Promise<WeatherForecast> {

    return mockWeatherData;
  }
}