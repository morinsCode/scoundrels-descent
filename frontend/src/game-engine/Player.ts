import type { Card } from "./types";

export class Player {
  maxHealth: number;
  currentHealth: number;
  weaponCarried: Card | null;
  weaponMaxMonsterValue: number | null;

  adjustHealth(amount: number): boolean {
    this.currentHealth += amount;
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth;
    }
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
    return this.isDead();
  }

  equipWeapon(newCard: Card): void {
    this.weaponCarried = newCard;
    this.weaponMaxMonsterValue = null;
  }

  registerWeaponKill(monsterValue: number): void {
    if (
      this.weaponMaxMonsterValue === null ||
      monsterValue > this.weaponMaxMonsterValue
    ) {
      this.weaponMaxMonsterValue = monsterValue;
    }
  }

  isDead(): boolean {
    return this.currentHealth <= 0;
  }

  constructor(maxHealth: number = 20) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.weaponCarried = null;
    this.weaponMaxMonsterValue = null;
  }
}
