# CLAUDE.md — Scoundrels Descent

## Project Description

Scoundrels Descent is a browser-based, turn-based dungeon-crawler card game inspired by the solitaire card game *Scoundrel* (© 2011 Zach Gage and Kurt Bieg). The player descends through a dungeon represented as a shuffled 44-card deck drawn from PostgreSQL. Each room presents four cards — monsters to fight, weapons to equip, and aid to restore health. The player must resolve at least three of the four before advancing. The run ends when the deck is exhausted (success, multiplier ×2) or the player's health reaches zero (failure, multiplier ×1). A global high score board is persisted in PostgreSQL and submitted via REST API at run end.

---

## Tech Stack and Key Dependencies

| Layer     | Technology                                                     |
|-----------|----------------------------------------------------------------|
| Frontend  | React 19, TypeScript ~5.9, Vite 7, MUI 7 (@mui/material)     |
| Backend   | Node.js, Express 5, TypeScript ^5.9, tsx (dev runner)         |
| Database  | PostgreSQL — `pg` (node-postgres) v8                          |
| Testing   | Cypress 15 (component tests + e2e), cypress-cucumber-preprocessor |
| Linting   | ESLint 9 flat config + typescript-eslint on both sides        |
| Formatting| Prettier (`semi: true`, `singleQuote: false`, `trailingComma: "none"`) |

No React Router — navigation is managed by `useState<Screen>` in `App.tsx`.

---

## Directory Structure

```
scoundrels-descent/
├── README.md                  # Project overview, setup, design decisions
├── ReadMeTDDTests.md          # Notes on TDD approach (Swedish, component-level)
├── init.sql                   # DB schema + full seed data (44 cards)
├── classdiagram.html          # Class diagram reference (HTML, not source)
├── .prettierrc.json           # Prettier config
├── _contextEngine/            # Documentation folder (this file lives here)
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx           # App entry; mounts React, ThemeProvider, CssBaseline
│   │   ├── App.tsx            # Top-level screen router (useState<Screen>)
│   │   ├── theme.ts           # MUI dark theme (gold primary, dark background)
│   │   ├── ScreenLayout.tsx   # Reusable layout wrapper (ThemeProvider + Container)
│   │   ├── api.ts             # Centralised API module (currently only fetchDbStatus)
│   │   │
│   │   ├── game-engine/       # Pure game logic — no React, no fetch
│   │   │   ├── types.ts       # Card, RunState, InProgressScreenProps
│   │   │   ├── Player.ts      # Player state: health, weapon, kills, damage tracking
│   │   │   ├── GameDeck.ts    # Deck: draw, putCardsOnBottom, remainingCards
│   │   │   ├── Room.ts        # Room: 4-card encounter, resolveCard, isResolved
│   │   │   └── GameState.ts   # Orchestrator: RunState machine, scoring
│   │   │
│   │   └── components/        # One component per application screen
│   │       ├── StartScreen.tsx        # Home; nav to game, highscores, how-to, about
│   │       ├── GameScreen.tsx         # Shell; fetches deck, manages GameState lifecycle
│   │       ├── NotStartedScreen.tsx   # "Ready to Start" pre-run screen
│   │       ├── InProgressScreen.tsx   # Active gameplay: cards, weapon toggle, flee
│   │       ├── CompletedRunScreen.tsx # Victory screen + highscore submission
│   │       ├── FailedScreen.tsx       # Death screen + highscore submission
│   │       ├── HighcoresScreen.tsx    # Fetches + displays top 10 scores
│   │       ├── HowToPlayScreen.tsx    # Static rules reference
│   │       └── AboutScreen.tsx        # Credits and creator note
│   │
│   ├── cypress/
│   │   ├── component/         # Cypress component tests (TDD: FailedScreen)
│   │   │   ├── FailedScreen.cy.tsx
│   │   │   ├── StartScreen.cy.tsx     # Entirely commented out — placeholder
│   │   │   └── features/             # Gherkin feature files
│   │   │       ├── failed-screen.feature
│   │   │       └── completed-run-screen.feature  # EMPTY — not yet written
│   │   ├── e2e/               # E2E tests against http://localhost:5173
│   │   │   ├── spec.cy.ts             # Smoke test (visit homepage)
│   │   │   ├── game-screen.cy.ts      # Smoke test (visit /game)
│   │   │   ├── combat-testing.cy.ts   # Full weapon-logic flow with cy.intercept
│   │   │   └── game-in.progress.cy.ts # Flee mechanic + recursive click-to-end test
│   │   └── support/
│   │       ├── GameScreenStylingWrapper.tsx  # TestWrapper for component tests
│   │       ├── component.ts / e2e.ts          # Cypress support files
│   │       └── commands.ts / commands.js      # Custom Cypress commands (empty)
│   │
│   ├── vite.config.ts         # Vite + proxy: /api → http://localhost:3000
│   ├── tsconfig.app.json      # strict, ES2022, noEmit, verbatimModuleSyntax
│   ├── tsconfig.node.json     # Node config for Vite config itself
│   ├── cypress.config.cjs     # Cypress config with Cucumber preprocessor (CJS)
│   └── eslint.config.js       # ESLint flat config: react-hooks, react-refresh
│
└── backend/
    ├── index.ts               # Express app: mounts routers, /api/db-test, listens :3000
    ├── database.ts            # pg Pool; reads PGURI env var; verifies connection on boot
    ├── test-db.ts             # Standalone DB connection test script (run manually)
    ├── routes/
    │   ├── cardsRoutes.ts     # GET /api/cards/deck
    │   └── highscoreRoutes.ts # GET /api/highscores, POST /api/highscores
    ├── controllers/
    │   ├── cardsController.ts      # Parses ?size= query param, calls service
    │   └── highscoreControllers.ts # Parses ?limit=, validates body, calls service
    ├── services/
    │   ├── cardsServices.ts        # SQL: SELECT … ORDER BY RANDOM() LIMIT $1
    │   └── highscoreServices.ts    # SQL: SELECT top N, INSERT highscore
    ├── tsconfig.json          # module: nodenext, strict, verbatimModuleSyntax
    ├── eslint.config.ts       # ESLint flat config: js/recommended + tseslint
    └── package.json           # scripts: dev (tsx --watch), test (not configured)
```

---

## Dev Commands

### Frontend (from `frontend/`)
```bash
npm run dev        # Start Vite dev server on http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # Preview production build
npx cypress open   # Launch Cypress GUI (component + e2e)
```

### Backend (from `backend/`)
```bash
npm run dev        # tsx --watch index.ts — hot-reload dev server on :3000
npx tsx test-db.ts # Standalone DB connection test
```

### Database (from repo root)
```bash
psql -U postgres -c "CREATE DATABASE scoundrels_descent;"
psql -U postgres -d scoundrels_descent -f init.sql
```

Backend requires a `backend/.env` file with `PGURI=postgresql://...` (note: README incorrectly says `DATABASE_URL` — see inconsistencies below).

---

## Coding Conventions

### Naming
- **PascalCase** for classes (`GameState`, `Player`, `Room`, `GameDeck`) and React components.
- **camelCase** for variables, functions, props, and type fields exported from game-engine and API layer.
- **snake_case** is used in the PostgreSQL schema (`card_type`, `image_url`, `player_name`, `achieved_at`). The service layer maps snake_case DB rows to camelCase via explicit `mapRowToCard()` / `mapRowToHighscore()` functions.
- Cypress test IDs use kebab-case: `data-testid="resolve-card-0"`.

### Typing
- Both frontend and backend use `"strict": true`. Frontend also enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- `type` is preferred over `interface` throughout (all prop types, Card, RunState, etc.).
- `import type` is used for type-only imports (`import type { Card } from "./types"`), enforced by `verbatimModuleSyntax`.
- Local DB row types are named `CardRow` / `Highscore` (unexported); the public API types are `Card` / `HighscoreAPI` (exported).

### Error Handling
- Frontend: `try/catch` with local `setError` state; errors displayed inline in JSX.
- Backend: all controller functions are `async` and wrap service calls in `try/catch`, passing errors to `next(error)` (Express error middleware pattern). `database.ts` calls `process.exit(-1)` on unexpected pool errors.
- Fetch errors in components are caught with `err instanceof Error ? err.message : "fallback string"`.

### Async Patterns
- All async frontend work uses `useEffect` with an inner `async function` pattern (named, then immediately invoked). No top-level awaits in components.
- Backend services are all `async` returning `Promise<T>`.
- Highscore POST and card fetch in `GameScreen` use bare `await fetch(...)` without a shared fetch wrapper (see inconsistencies).

### State Management
- Game state is held in mutable class instances (`GameState`, `Player`, etc.). React re-renders are triggered via a `forceUpdate` counter: `const [, forceUpdate] = useState(0)` — `forceUpdate(prev => prev + 1)` is called after each game action.
- Screen navigation is managed entirely by `useState<Screen>` in `App.tsx` — no routing library.

### Section Comments
- Backend files use `// === SECTION TITLE ===` as section headers.
- Frontend files mix `// === STYLING` / `// === REACT` / `// === TYPES` headers inconsistently.

---

## Key Domain Concepts

| Concept | Description |
|---------|-------------|
| `Card` | The atomic unit. Has `id`, `name`, `level` (2–14), `cardType` (`monster`/`weapon`/`aid`), `imageUrl`, `description`. |
| `GameDeck` | The full shuffled deck (44 cards). Supports `drawCards(n)` (mutating splice) and `putCardsOnBottom()` (for avoided rooms). |
| `Room` | A 4-card encounter. Tracks `numberOfCardsResolved`. A room `isResolved()` when ≥3 cards are resolved. The unresolved card carries over to the next room. |
| `Player` | Holds `currentHealth` (max 20), `weaponCarried`, `weaponMaxMonsterValue` (weapon lock), `monstersDefeated[]`, `totalHealthLost`. |
| `RunState` | `"not_started" → "in_progress" → "completed" \| "failed"`. Managed exclusively by `GameState`. |
| Weapon Lock | After using a weapon to kill a monster, `weaponMaxMonsterValue` is set to that monster's level. The weapon can only be used against monsters of equal or lower level thereafter. |
| Carry-over Card | When a room is resolved (3 cards done), the remaining card is kept in `currentRoom.cards` and passed to the next `Room` constructor alongside 3 fresh draws. |
| Avoid Room | Puts all current room cards on the deck bottom, draws 4 new cards. Sets `avoidedPreviousRoom = true`; cannot be done two rooms in a row. |
| Scoring | `(sum of monstersDefeated levels − totalHealthLost) × (2 if completed, 1 if failed)`. Calculated client-side in `GameState.scoreRun()`. |

---

## Architectural Rules (Observed Patterns)

1. **Game engine is framework-free.** Files under `frontend/src/game-engine/` have no React imports and no `fetch` calls. They are plain TypeScript classes.
2. **Backend is stateless.** No session, no in-memory game state. The server's only jobs are: serve a randomized card deck, store and return high scores.
3. **All API calls go through `/api/*` prefix**, proxied by Vite to `http://localhost:3000` in dev. No hardcoded port numbers in component fetch calls.
4. **Controllers only parse/validate HTTP concerns** (query params, body types). All DB interaction goes through the service layer.
5. **snake_case ↔ camelCase translation happens in the service layer**, never in controllers or routes.
6. **One component per screen.** Each screen is a single `.tsx` file in `components/`. Screens are swapped wholesale in `App.tsx`.

---

## Do Not Do

- **Do not add game logic to components.** Weapon damage, health calculations, and run-state transitions belong in `game-engine/`, not in JSX handlers. `InProgressScreen.tsx` already has a partial violation (it re-validates weapon level before calling `playerChooseCard`) — do not extend this pattern.
- **Do not add server-side game state or session management.** The README explicitly documents this as a deliberate tradeoff. The server does not track runs.
- **Do not use React Router.** Navigation is intentionally handled by `useState<Screen>` in `App.tsx`.
- **Do not call the backend with absolute URLs in components.** Always use `/api/...` paths so the Vite proxy handles the port mapping.
- **Do not import game-engine classes into `types.ts`.** `types.ts` is meant to be a leaf module. Currently `InProgressScreenProps` references `GameState` and `GameDeck` without importing them — this is a bug to fix, not a pattern to follow.

---

## Known Inconsistencies and TODOs

- **`types.ts` missing imports**: `InProgressScreenProps` references `GameState` and `GameDeck` but neither is imported in `types.ts`. This is a TypeScript compile error that should be addressed.
- **ThemeProvider nested redundantly**: `main.tsx` wraps the whole app in `ThemeProvider`+`CssBaseline`. `StartScreen.tsx` and `GameScreen.tsx` also wrap their return in `ThemeProvider`+`CssBaseline` directly. `ScreenLayout` is a third wrapper that does the same. The pattern is inconsistent: `HighcoresScreen`, `HowToPlayScreen`, and `AboutScreen` use `ScreenLayout`; `StartScreen` and `GameScreen` do not.
- **`api.ts` is not used for game API calls**: Card deck fetch and highscore POST/GET are inline `fetch()` calls in `GameScreen`, `CompletedRunScreen`, `FailedScreen`, and `HighcoresScreen`. Only `fetchDbStatus()` is in `api.ts`.
- **README says `DATABASE_URL`; code reads `PGURI`**: `backend/database.ts` line 6 reads `process.env.PGURI`. The README setup instructions say to set `DATABASE_URL`.
- **`CompletedRunScreen` and `FailedRunScreen` are nearly identical**: Both have identical highscore submission logic and identical score breakdown JSX.
- **`NotStartedScreen` type alias is misnamed**: `type NotStartedScreen = {...}` should be `type NotStartedScreenProps`.
- **`InProgressScreen` uses `card: any`**: `handleResolveCard(card: any)` at line 19 bypasses typing.
- **`HighcoresScreen` uses `useState<any[]>`**: Highscore response is untyped.
- **`GameState.avoidRoom()` has a doubled guard**: Lines 65–70 check `avoidedPreviousRoom` twice, with a commented-out `throw`. The commented-out throw is dead code.
- **Debug `console.log` calls remain**: `GameState.scoreRun()` and `GameScreen.tsx` contain `console.log` calls marked `// TODO Remove logs`.
- **Hardcoded deck total**: `InProgressScreen.tsx` displays `Cards remaining: X / 44` with a `// TODO hardcoded` comment.
- **Backend has no tests**: `package.json` test script exits with error 1.
- **`StartScreen.cy.tsx`**: Entirely commented out — placeholder, not functional.
- **`completed-run-screen.feature`**: Empty file — not yet written.
- **`_deck` parameter**: `Room.resolveCard()` receives a `GameDeck` parameter named `_deck` — it is currently unused. The leading underscore signals intentional non-use, likely reserved for future card interactions (traps, events).
