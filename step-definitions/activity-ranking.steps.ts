import {
  Given,
  Then,
  When,
  DataTable
} from "@cucumber/cucumber";

import { Activity } from "../types/activity-ranking.types";

import assert from "node:assert/strict";

import { ActivityRankingClient } from "../api/ActivityRankingClient";
import { config } from "../utils/config";
import {
  getActivityRankingResponse,
  getCityMatchResponse,
  getErrorResponse
} from "../utils/response-helper";
import { CustomWorld } from "./world";


Given(
  "the city {string} exists",
  function (city: string) {
    this.testCity = city;
  }
);


Given(
  "cities matching {string} exist",
  function (partialCity: string) {
    this.testCity = partialCity;
  }
);


Given(
  "the city {string} does not exist",
  function (city: string) {
    this.testCity = city;
  }
);


When(
  "I request activity rankings for {string}",
  async function (this: CustomWorld, city: string) {

    const client = new ActivityRankingClient(
      config.baseUrl
    );

    this.response = await client.getActivityRanking(city);
  }
);


Then(
  "the response status should be {int}",
  function (
    this: CustomWorld,
    expectedStatus: number
  ) {

    assert.equal(
      this.response?.status,
      expectedStatus
    );
  }
);


Then(
  "the response should contain 7 days of weather-based activity rankings",
  function (this: CustomWorld) {

    const body = getActivityRankingResponse(
      this.response!.data
    );

    assert.equal(
      body.days.length,
      7
    );
  }
);


Then(
  "the response should contain a list of possible city matches",
  function (this: CustomWorld) {

    const body = getCityMatchResponse(
      this.response!.data
    );

    assert.ok(
      Array.isArray(body.matches)
    );

    assert.ok(
      body.matches.length > 0
    );
  }
);


Then(
  "each day should contain rankings for:",
  function (
    this: CustomWorld,
    dataTable: DataTable
  ) {

    const expectedActivities =
      dataTable.raw().flat();

    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {

      const actualActivities =
        day.activities.map(
          activity => activity.activity
        );

      assert.equal(
        actualActivities.length,
        expectedActivities.length,
        `Expected ${expectedActivities.length} activities on ${day.date}`
      );

      assert.deepEqual(
        [...actualActivities].sort(),
        [...expectedActivities].sort(),
        `Unexpected activities on ${day.date}`
      );
    }
  }
);


Then(
  "each activity ranking should contain a date",
  function (this: CustomWorld) {

    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {

      assert.ok(
        day.date,
        "Expected each day to contain a date"
      );
    }
  }
);


Then(
  "each activity ranking should contain an activity name",
  function (this: CustomWorld) {

    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {

      for (const activity of day.activities) {

        assert.ok(
          activity.activity,
          "Expected activity name"
        );
      }
    }
  }
);


Then(
  "each activity ranking should contain a suitability measure",
  function (this: CustomWorld) {

    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {

      for (const activity of day.activities) {

        assert.equal(
          typeof activity.suitability,
          "number",
          `Expected numeric suitability for ${activity.activity} on ${day.date}`
        );
      }
    }
  }
);


Then(
  "each activity ranking should contain reasoning",
  function (this: CustomWorld) {
    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {
      for (const activity of day.activities) {

        assert.equal(
          typeof activity.reason,
          "string",
          `Expected reasoning for ${activity.activity} on ${day.date}`
        );

        assert.ok(
          activity.reason.trim().length > 0,
          `Expected non-empty reasoning for ${activity.activity} on ${day.date}`
        );
      }
    }
  }
);

Then(
  "the activities for each day should be ordered by weather suitability",
  function (this: CustomWorld) {

    const body = getActivityRankingResponse(
      this.response!.data
    );

    for (const day of body.days) {

      const scores =
        day.activities.map(
          activity => activity.suitability
        );

      for (
        let index = 1;
        index < scores.length;
        index++
      ) {

        assert.ok(
          scores[index - 1] >= scores[index],
          `Activities are not ordered by suitability on ${day.date}`
        );
      }
    }
  }
);


Then(
  "the response message should be {string}",
  function (
    this: CustomWorld,
    expectedMessage: string
  ) {

    const body = getErrorResponse(
      this.response!.data
    );

    assert.equal(
      body.message,
      expectedMessage
    );
  }
);