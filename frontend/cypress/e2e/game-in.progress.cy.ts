// === UI TESTING & PLAYER EXPERIENCE TESTING ===
// flaky, embrace chaos
// will randomilly click buttons until game fails or completes
// simulate playthroughs

describe("start and play game from the home page", () => {
  /*   beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.contains(/game screen/i).should("be.visible");
  }); */
  /*   it("start new game", () => {
    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.contains(/game screen/i).should("be.visible");
  }); */

  /*   it("test testing", () => {
    cy.contains("Game Screen").should("be.visible");
  }); */
  // TODO can not avoid room twice in a row
  it("prevents fleeing two rooms in a row", () => {
    cy.visit("http://localhost:5173");
    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.contains(/game screen/i).should("be.visible");
    cy.contains("button", /Flee To Next Room/i).should("not.be.disabled");
    cy.contains("button", /Flee To Next Room/i).click();
    cy.contains("Room: 2").should("be.visible");
    cy.contains("button", /Flee To Next Room/i).should("be.disabled");
  });

  // TODO test for picking up a weapon card

  // clicking left until game ends
  it("clicks left button", () => {
    cy.visit("http://localhost:5173");
    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.contains(/game screen/i).should("be.visible");
    cy.contains("button", /Resolve Card/i).click();
  });
  // TODO test for fighting a monster card with and without weapon
  // TODO fight monster without weapon
  // TODO pick up health potion

  // TODO pushed to completed run screen on completing all rooms
  // TODO pushed to failed run screen on player death
});
