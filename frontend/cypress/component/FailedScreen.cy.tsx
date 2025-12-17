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
  // ! Testing placeholder component rendering
  it("should render the FailedScreen component", () => {
    const gameState = new GameState([]);
    gameState.stateOfRun = "failed";
    gameState.roomIndex = 5;
    gameState.player.currentHealth = 0;

    cy.mount(
      <TestWrapper>
        <FailedRunScreen gameState={gameState} />
      </TestWrapper>
    );

    cy.contains("Run Failed").should("be.visible");
  });
});
