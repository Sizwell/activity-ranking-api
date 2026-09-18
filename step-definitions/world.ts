import { setWorldConstructor, World } from "@cucumber/cucumber";
import { AxiosResponse } from "axios";

import {
  ActivityRankingResponse,
  CityMatchResponse,
  ErrorResponse
} from "../types/activity-ranking.types";

export type ApiResponse = AxiosResponse<
  ActivityRankingResponse |
  CityMatchResponse |
  ErrorResponse
>;

export class CustomWorld extends World {

  response?: ApiResponse;

  testCity?: string;
}

setWorldConstructor(CustomWorld);