# Scoundrels Descent

A browser-based dungeon crawler card game, inspired by the card game *Scoundrel*. Built as a learning project to practice TypeScript, fullstack architecture, and class-based game logic.

---

## Overview

The player descends through a dungeon represented as a deck of cards. Each room presents four cards drawn from the deck — monsters to fight, weapons to equip, and aid to restore health. The player must resolve at least three of the four cards before moving on. Rooms can be avoided, but never two in a row.

The run ends either when the deck is exhausted (success) or when the player's health reaches zero (failure). A score is calculated based on monsters defeated and health lost, with a multiplier for completing the full descent.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, MUI |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL |
| Testing | Cypress (component + e2e) |

---

## Application Structure

**Frontend** handles all game logic. The game engine lives in `frontend/src/game-engine/` and runs entirely client-side. React components manage screen state and render the current game state to the player.

**Backend** is a thin REST API. It serves the card data from PostgreSQL on startup, and accepts high score submissions at the end of a run. There is no session or game state on the server.

```
frontend/
  src/
    game-engine/       # Core game logic (GameState, Room, Player, GameDeck)
    components/        # Screen components (StartScreen, GameScreen, etc.)
    api.ts             # API calls to backend

backend/
  routes/              # cardsRoutes, highscoreRoutes
  controllers/         # Route handlers
  services/            # DB queries
  database.ts          # pg pool setup
  index.ts             # Express entry point
```

---

## Core Concepts

### Game State

`GameState` orchestrates the run. It holds the current `Room`, the `Player`, the `GameDeck`, and a `RunState` (`not_started | in_progress | completed | failed`). The three main player actions are:

- `playerChooseCard(card, useWeapon)` — resolve a card in the current room
- `avoidRoom()` — skip the current room (cannot be done consecutively)
- `advanceToNextRoom()` — called automatically once a room is resolved

End conditions (player death or empty deck) are checked after every action.

### Card System

Cards are seeded in PostgreSQL and fetched via the API at startup. Each card has a `cardType` and a `level`:

- **Monster** — deals damage equal to its level (reduced if the player uses their equipped weapon)
- **Weapon** — equips to the player; the weapon's level reduces monster damage, but each weapon can only be used against monsters of decreasing value
- **Aid** — restores health equal to its level

Card levels run from 2 (weak) to 14 (boss-tier), covering a full spread of encounters.

### Turn Logic

Each room holds four cards. The player resolves them one at a time. Once three are resolved, the remaining card carries over into the next room. The player may equip a weapon or drink a potion at any point, but monster cards must be dealt with — fleeing carries a cost.

Scoring: `(sum of defeated monster levels − total health lost) × 2` for a completed run, or `× 1` for a failed one.

---

## Design Decisions

### Class-Based Game Engine

The game engine is modelled with TypeScript classes: `GameState`, `Player`, `Room`, and `GameDeck`. This was a deliberate choice — each class owns its own state and behaviour, which made it straightforward to reason about what should happen when a card is resolved, a weapon is used, or health changes.

Alternatives like a flat reducer or plain object approach would also work, but the class model mapped cleanly onto the domain and helped with learning TypeScript's type system in a structured way.

### Logic on the Frontend

All game logic runs on the client. The backend only stores cards and high scores. A more robust design would move score calculation and game validation to the server — that would prevent score manipulation and give the backend more meaningful responsibility. That tradeoff was made knowingly: keeping logic on the frontend made iteration faster and kept the focus on building out the game engine without needing to sync state across a network boundary. It's the right call for this stage of the project, and a clear path for future improvement.

---

## Features

- Turn-based dungeon crawl through a card deck
- Three card types: monsters, weapons, and aid
- Weapon system with diminishing returns (each kill must be weaker than the last)
- Room avoidance mechanic (limited to once per room sequence)
- Health and progression tracking throughout the run
- Score calculation at run end
- Global high score board (persisted in PostgreSQL)
- How to Play screen and About screen

---

## Running Locally

**Prerequisites:** Node.js, PostgreSQL

**1. Set up the database**

```bash
psql -U postgres -c "CREATE DATABASE scoundrels_descent;"
psql -U postgres -d scoundrels_descent -f init.sql
```

**2. Configure backend environment**

Create `backend/.env`:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/scoundrels_descent
```

**3. Start the backend**

```bash
cd backend
npm install
npm run dev
```

**4. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

---

## Future Improvements

- Move score calculation and run validation to the backend to improve integrity
- Add server-side input validation on high score submissions
- Expand card types (traps, events, curses)
- Persist run state across page refreshes
- Add authentication for named high score entries
