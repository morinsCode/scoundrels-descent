export type Card = {
  id: number;
  name: string;
  level: number;
  cardType: string;
  imageUrl: string;
  description: string;
};
/* 
export interface GameDeck {
  drawPile: Card[];
}

export interface Room {
  cards: Card[];
  numberOfCardsResolved: number;
}

export interface Player {
  maxHealth: number;
  currentHealth: number;
  weaponEquipped: Card | null;
}

export interface GameState {
  gameDeck: GameDeck;
  players: Player[];
  currentRoom: Room | null;
  stateOfRun: "not_started" | "in_progress" | "completed" | "failed";
  roomIndex: number;
  startRun(): void;
  advanceToNextRoom(): void;
  avoidRoom(): void;
  playerChooseCardToInteract(): void;
  scoreRun(): number;
}
 */
