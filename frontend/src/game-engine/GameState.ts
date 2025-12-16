import type { Card, RunState } from "../game-engine/types";
import { Player } from "../game-engine/Player";
import { GameDeck } from "../game-engine/GameDeck";
import { Room } from "../game-engine/Room";

export class GameState {
  gameDeck: GameDeck;
  player: Player;
  currentRoom: Room | null;
  stateOfRun: RunState;
  roomIndex: number;
  avoidedPreviousRoom: boolean;

  constructor(deckCards: Card[]) {
    this.gameDeck = new GameDeck(deckCards);
    this.player = new Player();
    this.currentRoom = null;
    this.stateOfRun = "not_started";
    this.roomIndex = 0;
    this.avoidedPreviousRoom = false;
  }

  startRun(): void {
    if (this.stateOfRun !== "not_started") return;

    this.stateOfRun = "in_progress";
    this.roomIndex = 0;
    this.avoidedPreviousRoom = false;
    this.createFirstRoom();
    this.checkEndConditions();
  }

  private createFirstRoom(): void {
    const cards = this.gameDeck.drawCards(4);
    if (cards.length === 0) {
      throw new Error("Tried to create first room, but deck is empty");
    }
    this.roomIndex = 1;
    this.currentRoom = new Room(cards);
  }

  advanceToNextRoom(): void {
    if (this.stateOfRun !== "in_progress") return;

    const carryOver: Card[] = this.currentRoom
      ? [...this.currentRoom.cards]
      : [];
    const needed = Math.max(0, 4 - carryOver.length);
    const newCards = needed > 0 ? this.gameDeck.drawCards(needed) : [];
    const roomCards = [...carryOver, ...newCards];

    if (roomCards.length === 0) {
      this.currentRoom = null;
      this.checkEndConditions();
      return;
    }

    this.roomIndex += 1;
    this.currentRoom = new Room(roomCards);
  }

  avoidRoom(): void {
    if (this.stateOfRun !== "in_progress") return;

    if (this.avoidedPreviousRoom) {
      throw new Error("Cannot avoid two rooms in a row");
    }

    if (this.currentRoom) {
      this.gameDeck.putCardsOnBottom(this.currentRoom.cards);
      this.currentRoom = null;
    }

    const cards = this.gameDeck.drawCards(4);

    if (cards.length === 0) {
      this.stateOfRun = "completed";
      this.checkEndConditions();
      return;
    }

    this.roomIndex += 1;
    this.currentRoom = new Room(cards);
    this.avoidedPreviousRoom = true;
  }

  playerChooseCard(card: Card, useWeapon: boolean): void {
    if (this.stateOfRun !== "in_progress") return;
    if (!this.currentRoom) return;

    this.currentRoom.resolveCard(card, this.player, this.gameDeck, useWeapon);

    this.checkEndConditions();
    if (this.stateOfRun !== "in_progress") return;

    if (this.currentRoom.isResolved()) {
      this.avoidedPreviousRoom = false;
      this.advanceToNextRoom();
      this.checkEndConditions();
    }
  }

  private checkEndConditions(): void {
    if (this.player.isDead()) {
      this.stateOfRun = "failed";
      return;
    }

    const noRoomCards =
      !this.currentRoom || this.currentRoom.cards.length === 0;

    if (this.gameDeck.isEmpty() && noRoomCards) {
      this.stateOfRun = "completed";
    }
  }

  scoreRun(): number {
    const monsterPoints = this.player.monstersDefeated.reduce(
      (sum, level) => sum + level,
      0
    );

    const healthPenalty = this.player.totalHealthLost;

    const baseScore = monsterPoints - healthPenalty;

    const completionMultiplier = this.stateOfRun === "completed" ? 2 : 1;

    const finalScore = baseScore * completionMultiplier;

    console.log("Score Calculation:", {
      monsterPoints,
      healthPenalty,
      baseScore,
      completionMultiplier,
      finalScore
    });

    return finalScore;
  }
}
