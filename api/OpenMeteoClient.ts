import axios, { AxiosInstance } from "axios";

import {
  WeatherForecast,
  WeatherDay
} from "../types/activity-ranking.types";

import {
  OpenMeteoForecastResponse
} from "../types/open-meteo.types";

import { WeatherProvider } from "./WeatherProvider";

export class OpenMeteoClient implements WeatherProvider {

  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.open-meteo.com"
    });
  }

  async getSevenDayForecast(
    latitude: number,
    longitude: number
  ): Promise<WeatherForecast> {

    const response = await this.client.get<OpenMeteoForecastResponse>(
      "/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          daily: [
            "temperature_2m_max",
            "precipitation_sum",
            "snowfall_sum",
            "cloudcover_mean"
          ].join(","),
          forecast_days: 7,
          timezone: "auto"
        }
      }
    );

    return this.mapResponse(response.data);
  }

  private mapResponse(
    data: OpenMeteoForecastResponse
  ): WeatherForecast {

    const days: WeatherDay[] = data.daily.time.map(
      (date, index) => ({
        date,
        snowfall: data.daily.snowfall_sum[index],
        precipitation: data.daily.precipitation_sum[index],
        temperature: data.daily.temperature_2m_max[index],
        cloudCover: data.daily.cloudcover_mean[index]
      })
    );

    return { days };
  }
}