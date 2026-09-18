import axios, { AxiosInstance, AxiosResponse } from "axios";

import {
  ActivityRankingResponse,
  CityMatchResponse,
  ErrorResponse
} from "../types/activity-ranking.types";

export type ActivityRankingApiResponse =
  | ActivityRankingResponse
  | CityMatchResponse
  | ErrorResponse;

export class ActivityRankingClient {

  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl
    });
  }

  async getActivityRanking(
    city: string
  ): Promise<AxiosResponse<ActivityRankingApiResponse>> {

    return this.client.get<ActivityRankingApiResponse>(
      "/api/activity-ranking",
      {
        params: {
          city
        },
        validateStatus: () => true
      }
    );
  }
}