describe("Weapon Logic Tests", () => {
  it("tests weapon damage calculations with fixed cards", () => {
    cy.visit("http://localhost:5173");

    cy.intercept("GET", "/api/cards/deck", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Sword",
          level: 3,
          cardType: "weapon",
          imageUrl: "https://placehold.co/150x200/png",
          description: "A sharp sword"
        },
        {
          id: 2,
          name: "Goblin",
          level: 4,
          cardType: "monster",
          imageUrl: "https://placehold.co/150x200/png",
          description: "Weak monster"
        },
        {
          id: 3,
          name: "Orc",
          level: 6,
          cardType: "monster",
          imageUrl: "https://placehold.co/150x200/png",
          description: "Medium monster"
        },
        {
          id: 4,
          name: "Troll",
          level: 8,
          cardType: "monster",
          imageUrl: "https://placehold.co/150x200/png",
          description: "Strong monster"
        }
      ]
    }).as("getDeck");

    cy.contains("button", /Start Game/i).click();
    cy.contains("button", /Start Run/i).click();
    cy.wait("@getDeck");

    cy.contains(/Health: 20 \/ 20/i).should("be.visible");

    cy.get('[data-testid="resolve-card-0"]').click();
    cy.contains(/Weapon Carried: Sword/i).should("be.visible");

    cy.get('[data-testid="resolve-card-0"]').click();
    cy.contains(/Health: 16 \/ 20/i).should("be.visible");

    cy.contains("button", /Toggle Weapon/i).click();
    cy.contains(/Armed/i).should("be.visible");

    cy.get('[data-testid="resolve-card-0"]').click();
    cy.contains(/Health: 13 \/ 20/i).should("be.visible");

    cy.get('[data-testid="resolve-card-0"]').click();
    cy.contains(
      /Monsters armor \(8\) to strong\. Weapon \(6\) to dull\. Fight unarmed/i
    ).should("be.visible");

    cy.contains(/Health: 13 \/ 20/i).should("be.visible");
    cy.contains("button", /Toggle Weapon/i).click();
    cy.get('[data-testid="resolve-card-0"]').click();
    cy.contains(/Run Completed!/i).should("be.visible");
  });
});
