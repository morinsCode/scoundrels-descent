// === UI TESTING & PLAYER EXPERIENCE TESTING ===

describe("start and play game from the home page til end", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.contains(/game screen/i).should("be.visible");
  });

  it("prevents fleeing two rooms in a row", () => {
    cy.contains("button", /Flee To Next Room/i).should("not.be.disabled");
    cy.contains("button", /Flee To Next Room/i).click();
    cy.contains("Room: 2").should("be.visible");
    cy.contains("button", /Flee To Next Room/i).should("be.disabled");
  });

  it("clicks button 0 until death or victory", () => {
    const clickUntilEnd = () => {
      cy.get("body").then(($body) => {
        const text = $body.text();
        if (
          text.indexOf("YOU DIED") !== -1 ||
          text.indexOf("Run Completed!") !== -1
        ) {
          return;
        }
        cy.get('[data-testid="resolve-card-0"]').then(($btn) => {
          if ($btn.is(":visible") && !$btn.is(":disabled")) {
            cy.wrap($btn).click();
            clickUntilEnd();
          }
        });
      });
    };

    clickUntilEnd();

    cy.contains(/YOU DIED|Run Completed!/i, { timeout: 10000 }).should(
      "be.visible"
    );
  });
});
