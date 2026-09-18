Feature: Activity Ranking API - City-Based Weather Forecast Integration

  As a user
  I want to provide a city or town name
  So that I can receive activities ranked by weather suitability for the next 7 days


  Scenario: Get activity rankings for a valid city
    Given the city "Cape Town" exists
    When I request activity rankings for "Cape Town"
    Then the response status should be 200
    And the response should contain 7 days of weather-based activity rankings


  Scenario: Search for a city using a partial name
    Given cities matching "Cape" exist
    When I request activity rankings for the partial city name "Cape"
    Then the response status should be 200
    And the response should contain a list of possible city matches


  Scenario: Each day contains all supported activities
    Given the city "Cape Town" exists
    When I request activity rankings for "Cape Town"
    Then each day should contain rankings for:
      | activity              |
      | Skiing                |
      | Surfing               |
      | Outdoor Sightseeing   |
      | Indoor Sightseeing    |


  Scenario: Each activity ranking contains the required information
    Given the city "Cape Town" exists
    When I request activity rankings for "Cape Town"
    Then each activity ranking should contain a date
    And each activity ranking should contain an activity name
    And each activity ranking should contain a suitability measure
    And each activity ranking should contain reasoning


  Scenario: Activities are ranked according to weather suitability
    Given the city "Cape Town" exists
    When I request activity rankings for "Cape Town"
    Then the activities for each day should be ordered by weather suitability


  Scenario: An unknown city is rejected
    Given the city "Atlantis123" does not exist
    When I request activity rankings for "Atlantis123"
    Then the response status should be 404
    And the response message should be "City not found"