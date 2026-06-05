# ARCHITECTURE.md — Scoundrels Descent

## System Overview

Scoundrels Descent is split into two independent processes:

```
Browser (React SPA)                    Node.js (Express API)
─────────────────────────────────      ─────────────────────────────
App.tsx (screen router)                index.ts (entry, :3000)
│                                      │
├── GameScreen                         ├── /api/cards/deck      ──► cardsService ──► PostgreSQL
│   └── game-engine/ (classes)         └── /api/highscores      ──► highscoreService ──► PostgreSQL
│
├── HighcoresScreen ────────────────── GET /api/highscores
├── CompletedRunScreen ──────────────── POST /api/highscores
├── FailedRunScreen ─────────────────── POST /api/highscores
└── StartScreen ─────────────────────── GET /api/db-test
```

All game logic runs client-side. The server has no knowledge of run state.

---

## Frontend

### App.tsx — Screen Router

`App.tsx` owns a single piece of state: `screen: "start" | "game" | "highscores" | "howtoplay" | "about"`. It renders exactly one screen component at a time, passing callbacks (`onStartNewGame`, `onBackToMenu`, etc.) as props. There is no routing library.

```
App
 ├── screen === "start"       → <StartScreen>
 ├── screen === "game"        → <GameScreen>
 ├── screen === "highscores"  → <HighcoresScreen>
 ├── screen === "howtoplay"   → <HowToPlayScreen>
 └── screen === "about"       → <AboutScreen>
```

### GameScreen.tsx — Game Lifecycle Shell

`GameScreen` is the only component that manages `GameState`. Its responsibilities:

1. **Deck initialization** (`useEffect`, runs once): `fetch("/api/cards/deck")` → constructs `GameDeck` → stores in `useState<GameDeck>`.
2. **GameState initialization** (`useEffect`, runs when `gameDeck` changes): constructs `new GameState(gameDeck.drawPile)` → stores in `useState<GameState>`.
3. **Sub-screen routing**: based on `gameState.stateOfRun`, renders one of four child components:
   - `"not_started"` → `<NotStartedScreen>`
   - `"in_progress"` → `<InProgressScreen>`
   - `"completed"` → `<CompletedRunScreen>`
   - `"failed"` → `<FailedRunScreen>`
4. **Force re-render**: because `GameState` is a mutable class instance (not plain React state), mutations don't trigger React re-renders. A `forceUpdate` counter (`const [, forceUpdate] = useState(0)`) is incremented via `onUpdate` callback after every game action.

### InProgressScreen.tsx — Active Gameplay

Receives `gameState`, `gameDeck`, and `onUpdate` (typed via `InProgressScreenProps` from `types.ts`).

Responsibilities:
- Renders current room cards as clickable card UI elements.
- Manages a local `useWeapon: boolean` toggle.
- On card click, calls `handleResolveCard(card)` which:
  1. Validates weapon lock client-side (duplicating logic from `Room.resolveMonster()`) and shows an inline error message if invalid.
  2. Calls `gameState.playerChooseCard(card, isArmed)`.
  3. Calls `onUpdate()` to trigger parent re-render.
- "Flee To Next Room" button calls `gameState.avoidRoom()` then `onUpdate()`. Disabled when `gameState.avoidedPreviousRoom` is `true`.
- Cards remaining display: `gameDeck?.remainingCards() / 44` (total hardcoded).
- Card images use a `placehold.co` fallback on `onError`.

**Note:** Card resolution index uses array position (`data-testid="resolve-card-{index}"`), not card ID. This means test selectors are position-dependent.

### CompletedRunScreen.tsx and FailedRunScreen.tsx — End Screens

These two components are structurally identical, differing only in the heading ("YOU SURVIVED" vs "YOU DIED") and the completion multiplier applied by `gameState.scoreRun()` (×2 for completed, ×1 for failed).

Both:
1. Call `gameState.scoreRun()` immediately on render to compute `finalScore`.
2. Display a score breakdown: monster points, health penalty, final score.
3. Provide a name entry field + "Save Highscore" button.
4. On submit: POST to `/api/highscores` with `{ playerName, score }`. Uses local `isSaving`/`saved`/`saveError` state to manage the button lifecycle.

**Duplication:** The entire highscore submission block (state, handler, JSX) is copy-pasted between the two. A shared component or hook would eliminate this.

### HighcoresScreen.tsx, HowToPlayScreen.tsx, AboutScreen.tsx — Secondary Screens

All three use `ScreenLayout` as their outer wrapper (unlike `StartScreen` and `GameScreen` which wrap themselves in `ThemeProvider` directly — see inconsistencies in CLAUDE.md).

`HighcoresScreen` fetches `GET /api/highscores` on mount, stores results in `useState<any[]>` (untyped), and renders each entry as a `Typography` line: `playerName - score - date`.

---

## Game Engine

The game engine is five files in `frontend/src/game-engine/`. None import React or use fetch. All game state is in mutable class instances.

### types.ts

Defines three exported types:
- `Card` — the data shape for a card as received from the API.
- `RunState` — the four-value union for run lifecycle.
- `InProgressScreenProps` — prop type for `InProgressScreen`. **Bug:** references `GameState` and `GameDeck` without importing them.

### GameDeck.ts

Wraps a `Card[]` array (`drawPile`). Mutations are direct array operations:
- `drawCards(n)`: `splice(0, n)` — removes from the front.
- `putCardsOnBottom(cards)`: `push(...)` — appends to end.

The deck is passed in as a pre-shuffled array from the API (`ORDER BY RANDOM()`). `GameDeck` has no shuffle logic of its own.

### Player.ts

Tracks all player-relevant state across a run:

| Field | Purpose |
|-------|---------|
| `currentHealth` / `maxHealth` | Health pool (default max: 20) |
| `weaponCarried` | Currently equipped `Card` or `null` |
| `weaponMaxMonsterValue` | Last monster level killed with the weapon (weapon lock) |
| `monstersDefeated` | Array of monster levels, used for score calculation |
| `totalHealthLost` | Running damage total, used for score penalty |

`adjustHealth(amount)`: clamps health to [0, maxHealth]. Returns `isDead()` boolean but the caller (`Room.resolveMonster`) ignores the return value — end conditions are checked separately by `GameState.checkEndConditions()`.

`equipWeapon(card)`: sets `weaponCarried` and **resets `weaponMaxMonsterValue` to null** (a new weapon has no kill history).

`registerWeaponKill(monsterValue)`: sets `weaponMaxMonsterValue = monsterValue` after a weapon kill.

### Room.ts

Manages a single 4-card encounter.

`resolveCard(card, player, _deck, useWeapon)`:
1. Removes `card` from `this.cards` (by reference equality).
2. Dispatches to `resolveAid`, `resolveWeapon`, or `resolveMonster` based on `card.cardType`.
3. Increments `numberOfCardsResolved`.

`resolveMonster(card, player, useWeapon)` — weapon damage logic:
- Computes `canUseWeapon`: player has a weapon AND (`weaponMaxMonsterValue` is null OR monster level ≤ last kill level).
- If `willUseWeapon` (user chose to + `canUseWeapon`): `damage = monsterLevel - weaponLevel`, floored at 0. Calls `player.registerWeaponKill(monsterValue)`.
- Always calls `player.adjustHealth(-damage)` and `player.recordMonsterDefeat(monsterValue)`.

`isResolved()`: `numberOfCardsResolved >= 3`.

The `_deck` parameter is currently unused (prefixed `_` intentionally — reserved for future card types like traps).

### GameState.ts

The run orchestrator. Owns and creates `GameDeck`, `Player`, and `Room` instances.

**State fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `gameDeck` | `GameDeck` | The full deck |
| `player` | `Player` | Player state |
| `currentRoom` | `Room \| null` | Active room |
| `stateOfRun` | `RunState` | Lifecycle state |
| `roomIndex` | `number` | Room counter (1-based) |
| `avoidedPreviousRoom` | `boolean` | Flee throttle |

**State transitions:**

```
not_started
   │  startRun()
   ▼
in_progress
   │  playerChooseCard() / avoidRoom()
   │  checkEndConditions() after each action
   ├──► failed   (player.isDead())
   └──► completed (gameDeck.isEmpty() && no room cards remain)
```

**`playerChooseCard(card, useWeapon)`:**
1. Calls `currentRoom.resolveCard(...)`.
2. Calls `checkEndConditions()` — if run ended, returns early.
3. If `currentRoom.isResolved()`, resets `avoidedPreviousRoom = false` and calls `advanceToNextRoom()`, then `checkEndConditions()` again.

**`advanceToNextRoom()`:**
- Carry-over cards from the current room fill slots 1–(4-n), then n new cards are drawn.
- If combined roomCards is empty: sets `currentRoom = null` and checks end conditions.

**`avoidRoom()`:**
- Guard: `if (avoidedPreviousRoom) return` — silently no-ops instead of throwing (see CLAUDE.md inconsistencies).
- Puts current room cards on deck bottom.
- Draws 4 new cards.
- Sets `avoidedPreviousRoom = true`.

**`scoreRun()`:**
```
finalScore = (sum(monstersDefeated) − totalHealthLost) × multiplier
multiplier = stateOfRun === "completed" ? 2 : 1
```
Contains `console.log` debug output (marked TODO).

---

## Backend

### index.ts — Express Entry Point

Mounts two routers:
- `app.use("/api/cards", cardsRouter)` → resolves to `/api/cards/deck`
- `app.use("/api", highscoreRouter)` → resolves to `/api/highscores`

Also defines a one-off diagnostic endpoint: `GET /api/db-test` (inline handler, not via the router pattern). This endpoint is called by `StartScreen` via `api.ts:fetchDbStatus()` to show DB connection status on the home screen.

Listens on port 3000 (hardcoded).

### database.ts — Connection Pool

Reads `PGURI` from environment (via `dotenv`). Throws synchronously if `PGURI` is unset — this makes misconfiguration fail fast at startup. Exports a single `pool` used by both service modules.

**Note:** README setup instructions say to set `DATABASE_URL`. The actual env var is `PGURI`.

### Routes → Controllers → Services — Three-Layer Pattern

```
Route file          Controller file              Service file
─────────────       ────────────────────────     ──────────────────────────
cardsRoutes.ts      cardsController.ts           cardsServices.ts
  GET /deck   ───►  getDeckController()    ───►  getRandomDeck(size)
                    parses ?size= param           SQL + mapRowToCard()

highscoreRoutes.ts  highscoreControllers.ts      highscoreServices.ts
  GET /highscores ► getHighscoresController() ►  getTopHighscores(limit)
  POST /highscores► postHighscoreController()    SQL + mapRowToHighscore()
                    parses ?limit= param          postHighscore(name, score)
                    validates { playerName, score }
```

**Controllers** are responsible for: parsing query params, validating request body types, calling the service, sending HTTP responses, calling `next(error)` on failure.

**Services** are responsible for: constructing and executing parameterized SQL queries, mapping DB rows to API types.

**No ORM.** All SQL is written directly as template literals with `$1, $2` positional parameters.

### Data Mapping (snake_case ↔ camelCase)

Services define two local types per table:

| DB row type | API type |
|------------|---------|
| `CardRow` (unexported) | `Card` (exported) |
| `Highscore` (unexported) | `HighscoreAPI` (exported) |

Each service file has an explicit `mapRow*` function that translates field names. This is the only place where `card_type` → `cardType`, `image_url` → `imageUrl`, etc. is done.

---

## Data Flow: Starting a Game

```
1. User clicks "Start Game" in StartScreen
   → App.tsx setScreen("game")

2. GameScreen mounts
   → useEffect #1: fetch("/api/cards/deck")
     → Vite proxy forwards to http://localhost:3000/api/cards/deck
     → getDeckController: parses size (default 44)
     → getRandomDeck(44): SELECT ... ORDER BY RANDOM() LIMIT 44
     → returns Card[] (camelCase) as JSON
   → new GameDeck(cards), setGameDeck(deck)

3. useEffect #2 fires (gameDeck changed)
   → new GameState(gameDeck.drawPile), setGameState(state)
   → state.stateOfRun === "not_started"

4. NotStartedScreen renders with a "Start Run" button
   → onClick: gameState.startRun(); forceUpdate(n+1)
   → startRun() sets stateOfRun = "in_progress", creates first Room (4 cards)

5. GameScreen re-renders → InProgressScreen renders
   → Displays room cards, health, weapon state

6. Player clicks "Resolve Card"
   → handleResolveCard(card)
   → gameState.playerChooseCard(card, isArmed)
   → Room.resolveCard → Player state updated
   → checkEndConditions: if dead → "failed", if deck exhausted → "completed"
   → if room resolved (3 cards) → advanceToNextRoom() draws next 4
   → onUpdate() → forceUpdate(n+1)

7. Re-render: stateOfRun determines which sub-screen shows
```

## Data Flow: Submitting a High Score

```
1. Run ends (stateOfRun = "failed" or "completed")
   → GameScreen renders FailedRunScreen or CompletedRunScreen
   → Component calls gameState.scoreRun() on render

2. Player enters name, clicks "Save Highscore"
   → handleSave()
   → fetch POST /api/highscores { playerName, score }
   → postHighscoreController: validates types
   → postHighscore(playerName, score): INSERT INTO highscores

3. On success: button disabled, "Highscore saved" shown
```

---

## Testing Architecture

### Component Tests (Cypress)
Located in `frontend/cypress/component/`. Use `cy.mount()` with `TestWrapper` (from `cypress/support/GameScreenStylingWrapper.tsx`) which provides `ThemeProvider` + `CssBaseline` + `Container`.

**`FailedScreen.cy.tsx`** — the primary TDD test. Constructs a `GameState` directly, manually sets its fields (`stateOfRun`, `roomIndex`, `player.monstersDefeated`, `player.totalHealthLost`), mounts `FailedRunScreen`, and asserts rendered text.

**`StartScreen.cy.tsx`** — entirely commented out. Placeholder only.

**Feature files** (Gherkin): two `.feature` files exist in `cypress/component/features/`. `failed-screen.feature` defines five scenarios but only one (`FailedScreen.cy.tsx`) has a corresponding implementation. `completed-run-screen.feature` is empty.

### E2E Tests (Cypress)
Located in `frontend/cypress/e2e/`. All require the full stack running (`localhost:5173` + `localhost:3000` + PostgreSQL).

- **`spec.cy.ts`**: smoke test — visits homepage.
- **`game-screen.cy.ts`**: visits `/game` route (which doesn't exist as a route — app is SPA, this would show the default screen, not the game).
- **`combat-testing.cy.ts`**: the most complete test. Uses `cy.intercept` to stub `/api/cards/deck` with a fixed 4-card deck, then plays through a full combat sequence verifying health values, weapon lock enforcement, and the run-completed state.
- **`game-in.progress.cy.ts`**: tests the flee mechanic and has a recursive `clickUntilEnd()` helper that clicks `resolve-card-0` repeatedly until "YOU DIED" or "Run Completed!" appears.

### No Backend Tests
`backend/package.json` `test` script is `echo "Error: no test specified" && exit 1`. There are no unit or integration tests for the backend.
