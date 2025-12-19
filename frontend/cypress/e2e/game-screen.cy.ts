describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173");
  });

  it("should display the game screen", () => {
    cy.visit("http://localhost:5173/game");
    cy.contains("Quit Game").should("be.visible");
  });
});
