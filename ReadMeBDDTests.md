# Angående TDD

- Jag har två komponenter för kravet om att skapa tester före kodning
- Testningen gäller komponenterna
  - src/components/FaliedScreen.tsx
  - src/components/CompletedRunScreen.tsx
- Komopnenterna och props för dom är skapade innan testerna började skrivas, men är enklare placholders.

- Testfilerna för dessa komponenter hittas under frontend/cypress/component
- COMMITS
  - Commits startar med TDD:
  - 67c3c88 TDD: initial cypress test file FailedScreen.cy.ts
    - Först commit för TDD
