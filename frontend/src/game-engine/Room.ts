import type { Card } from "../game-engine/types";
import { GameDeck } from "../game-engine/GameDeck";
import { Player } from "../game-engine/Player";

export class Room {
  cards: Card[];
  numberOfCardsResolved: number;

  constructor(cards: Card[]) {
    this.cards = cards;
    this.numberOfCardsResolved = 0;
  }

  resolveCard(
    card: Card,
    player: Player,
    _deck: GameDeck,
    useWeapon: boolean
  ): void {
    this.cards = this.cards.filter((c) => c !== card);

    switch (card.cardType) {
      case "aid":
        this.resolveAid(card, player);
        break;
      case "weapon":
        this.resolveWeapon(card, player);
        break;
      case "monster":
        this.resolveMonster(card, player, useWeapon);
        break;
      default:
        // TODO if adding events,traps etc
        break;
    }

    this.numberOfCardsResolved += 1;
  }

  private resolveAid(card: Card, player: Player): void {
    player.adjustHealth(card.level);
  }

  private resolveWeapon(card: Card, player: Player): void {
    player.equipWeapon(card);
  }

  private resolveMonster(card: Card, player: Player, useWeapon: boolean): void {
    const monsterValue = card.level;
    let damage = monsterValue;

    const hasWeapon = player.weaponCarried !== null;
    const max = player.weaponMaxMonsterValue;
    const withinLimit = max === null || monsterValue <= max;
    const canUseWeapon = hasWeapon && withinLimit;
    const willUseWeapon = useWeapon && canUseWeapon;

    if (willUseWeapon && player.weaponCarried) {
      damage = monsterValue - player.weaponCarried.level;
      if (damage < 0) {
        damage = 0;
      }
      player.registerWeaponKill(monsterValue);
    }

    player.adjustHealth(-damage);
    player.recordMonsterDefeat(monsterValue);
  }

  isResolved(): boolean {
    return this.numberOfCardsResolved >= 3;
  }
}
