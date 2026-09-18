import {
  ActivityRankingResponse,
  CityMatchResponse,
  ErrorResponse
} from "../types/activity-ranking.types";

type ApiResponseBody =
  | ActivityRankingResponse
  | CityMatchResponse
  | ErrorResponse;

export function getActivityRankingResponse(
  data: ApiResponseBody
): ActivityRankingResponse {

  if (!("days" in data)) {
    throw new Error("Expected an activity ranking response");
  }

  return data;
}

export function getCityMatchResponse(
  data: ApiResponseBody
): CityMatchResponse {

  if (!("matches" in data)) {
    throw new Error("Expected a city match response");
  }

  return data;
}

export function getErrorResponse(
  data: ApiResponseBody
): ErrorResponse {

  if (!("message" in data)) {
    throw new Error("Expected an error response");
  }

  return data;
}