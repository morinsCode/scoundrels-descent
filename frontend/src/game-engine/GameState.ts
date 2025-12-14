// imports for classes and types used in this file
import type { Card, RunState } from "../game-engine/types";
import { Player } from "../game-engine/Player";
import { GameDeck } from "../game-engine/GameDeck";
import { Room } from "../game-engine/Room";

export class GameState {
  gameDeck: GameDeck;
  player: Player;
  currentRoom: Room | null;
  stateOfRun: "not_started" | "in_progress" | "completed" | "failed";
  roomIndex: number;
  avoidedPreviousRoom: boolean;

  // # first room starts with 4 cards, Later rooms should be: carry-over + draw (up to) 3
  /*   - Look at `currentRoom`’s remaining card(s) (carry-over). - Draw `needed = 4 - carryOver.length` from deck. - If there are no cards in deckat all → mark run `"completed"`. */
  constructor(deckCards: Card[]) {
    this.gameDeck = new GameDeck(deckCards);
    this.player = new Player();
    this.currentRoom = null;
    this.stateOfRun = "not_started";
    this.roomIndex = 0;
    this.avoidedPreviousRoom = false;
  }

  startRun(): void {
    this.stateOfRun = "in_progress";
    this.advanceToNextRoom();
  }

  advanceToNextRoom(): void {
    const roomCards = this.gameDeck.drawCards(3);
    this.currentRoom = new Room(roomCards);
    this.roomIndex += 1;
  }

  avoidRoom(): void {
    //advanceToNextRoom without resolving current room and putCardsOnBottom
    // can only avoid one room in a row

    /* Missing bits:
- After avoiding, you should **immediately** create a new room (unless the deck is empty). Right now you end up with `currentRoom = null` and nothing else.
- `avoidedPreviousRoom` should later be reset to `false` when you resolve a room normally (in `advanceToNextRoom` after a non-avoided room). */

    if (this.avoidedPreviousRoom) {
      throw new Error("Cannot avoid two rooms in a row");
    }
    if (this.currentRoom) {
      this.gameDeck.putCardsOnBottom(this.currentRoom.cards);
    }
    this.avoidedPreviousRoom = true;
    this.roomIndex += 1;
    this.currentRoom = null;
  }

  playerChooseCardToInteract(): void {
    // - “player clicked card in UI”
    //    - “Room resolves it, health changes, maybe go to next room or end run”
  }

  scoreRun(): number {
    // Implementation for scoring the run
    // score is calculated on levels of monsters defeated -  health lost + bonus point for completing full run (44 cards), total score POSTed to backend on "completed" or "failed"
    return 0;
  }
}
