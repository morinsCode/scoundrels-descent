Feature: Failed Screen Display

As a player 
I want to see total score and score calculation so I understand the scoring system.
I want to see stats collected from my run displayed.
I want to submit a name so it can be stored with my score and potentially see my
score on the high score list (Hall Of Fame)

Scenario: Display score calculation at early death
    Given I have a failed game state at room 1
    When I render the FailedScreen component
    Then I should see total score 
    And score for killed monsters
    And health penalty due to damage taken

Scenario: Display score calculation at mid-game death
    Given I have a failed game state at room 7
    When I render the FailedScreen component
    Then I should see total score 
    And score for killed monsters
    And health penalty due to damage taken

Scenario: Display score calculation at late-game death
    Given I have a failed game state at room 14
    When I render the FailedScreen component
    Then I should see total score 
    And score for killed monsters
    And health penalty due to damage taken

Scenario: Display stats gathered from run   
    Given I have a failed game state at room 7 with 5 monsters defeated, cleared 6 rooms and defeated at least one Level 14 monster
    When I render the FailedScreen component
    Then I should see "Monsters Defeated: 5"
    And I should see "Number of rooms cleared: 6"
    And I should see "Strongest monster defeated: Level 14"



Scenario: Submit name for high score
    Given I have a failed game state with a positive score
    When I enter my name "PlayerOne"
    And I submit the score
    Then my score should be saved with my name

