import type { Card } from "../game-engine/types";
import { GameDeck } from "../game-engine/GameDeck";

export class Room {
  cards: Card[]; //drawn from GameDeck
  numberOfCardsResolved: number;

  constructor(cards: Card[]) {
    this.cards = cards;
    this.numberOfCardsResolved = 0;
  }

  resolveCard(card: Card, player: Player, deck: GameDeck): void {
    // Logic to resolve the card's effect on the player
    // For example, if the card is a healing card:
    // if (card.cardType === "healing") {
    //   player.heal(10); // Heal player by 10 points
    // }

    /*     resolveMonster(card, useWeapon: boolean) {
  if (useWeapon && player.weaponEquipped) {
    // weapon attack
  } else {
    // barehanded
  }
} */

    this.numberOfCardsResolved += 1;
  }

  isResolved(): boolean {
    return this.numberOfCardsResolved >= 3;
  }
}
