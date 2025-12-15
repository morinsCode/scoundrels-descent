export type Card = {
  id: number;
  name: string;
  level: number;
  cardType: string;
  imageUrl: string;
  description: string;
};

export type RunState = "not_started" | "in_progress" | "completed" | "failed";

export type InProgressScreenProps = {
  gameState: GameState;
  gameDeck: GameDeck | null;
  onUpdate: () => void;
};
