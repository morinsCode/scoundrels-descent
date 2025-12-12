import type { Card } from "../game-engine/types";
/* import { GameDeck } from "../game-engine/GameDeck"; */
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
    //deck: GameDeck,
    useWeapon: boolean
  ): void {
    // # Find and remove the card from this room
    this.cards = this.cards.filter((c) => c !== card);

    // # Apply effect depending on card type
    switch (card.cardType) {
      case "aid": // potions / healing
        this.resolveAid(card, player);
        break;
      case "weapon":
        this.resolveWeapon(card, player);
        break;
      case "monster":
        this.resolveMonster(card, player, useWeapon);
        break;
      default:
        // # if adding events,traps etc
        break;
    }

    // # card has been resolved
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

    // # can weapon be used?
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
  }

  /* 
  private resolveMonster(card: Card, player: Player, useWeapon: boolean): void {
    // TODO: decide barehand vs weapon attack and call player.adjustHealth / registerWeaponKill
    // Option to fight barehanded or with weapon.
    // Weapon reduces damage by its value.
    // Weapon tracks the highest-value monster it has killed and can’t be used on stronger ones later.

    const damage = card.level;

    // check if weaponMaxMonsterValue < monster.level then force barehanded
    if (
      useWeapon &&
      player.weaponCarried &&
      player.weaponMaxMonsterValue !== null &&
      card.level > player.weaponMaxMonsterValue
    ) {
      useWeapon = false; // force barehanded
    }

    //     if (useWeapon && player.weaponCarried) {
    // Reduce damage by weapon value
    //      damage -= player.weaponCarried.level;
    // Register weapon kill
    //      player.registerWeaponKill(card.level);
    //    }

    // Apply damage to player
    player.adjustHealth(-damage);
  }

  isResolved(): boolean {
    return this.numberOfCardsResolved >= 3;
  }
} */
}
