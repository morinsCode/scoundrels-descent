// === COMPONENT TEST FAILEDSCREEN

import { FailedRunScreen } from "../../src/components/FailedScreen";
import { GameState } from "../../src/game-engine/GameState";
import { TestWrapper } from "../support/GameScreenStylingWrapper";

// # Feature: Display Failed Run Screen
// # As a player, when I die
// # I want to see stats collected from my run displayed.
// # I want to submit a name so it can be stored with my score and potentially see my score on the high score list (Hall Of Fame)

// # Scenario: Displaying the Failed Run Screen
describe("FailedRunScreen Component", () => {
  // # Scenario: Display score with calculation breakdown
  it("should display total score with monster points and health penalty breakdown", () => {
    const gameState = new GameState([]);
    gameState.stateOfRun = "failed";
    gameState.roomIndex = 5;
    gameState.player.currentHealth = 0;

    gameState.player.monstersDefeated = [3, 5, 7, 14]; // Total 29 points
    gameState.player.totalHealthLost = 10; // Health penalty 10 points

    // Mock the scoreRun
    cy.stub(gameState, "scoreRun").returns(29 - 10); // Total score 19 points

    cy.mount(
      <TestWrapper>
        <FailedRunScreen gameState={gameState} />
      </TestWrapper>
    );
    // Died in Room 5
    cy.contains("YOU DIED").should("be.visible");
    cy.contains("5").should("be.visible");
    // Monsters defeated
    cy.contains(/Monster points|Score for killed monsters/i).should(
      "be.visible"
    );
    cy.contains("3,5,7,14").should("be.visible");
    //Health lost
    cy.contains(/Health penalty|damage taken/i).should("be.visible");
    cy.contains("10").should("be.visible");
    // Total score
    cy.contains(/Score:|Total Score:/i).should("be.visible");
    cy.contains("29").should("be.visible");
    // Final score
    cy.contains("19").should("be.visible");
  });
});
