import type { Card } from "./types";

export class GameDeck {
  drawPile: Card[];

  constructor(cards: Card[]) {
    this.drawPile = cards;
  }

  drawCards(count: number): Card[] {
    return this.drawPile.splice(0, count);
  }

  putCardsOnBottom(cards: Card[] | Card): void {
    if (Array.isArray(cards)) {
      this.drawPile.push(...cards);
    } else {
      this.drawPile.push(cards);
    }
  }

  remainingCards(): number {
    return this.drawPile.length;
  }

  isEmpty(): boolean {
    return this.drawPile.length === 0;
  }
}
