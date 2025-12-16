import type { Card } from "./types";

export class Player {
  maxHealth: number;
  currentHealth: number;
  weaponCarried: Card | null;
  weaponMaxMonsterValue: number | null;
  monstersDefeated: number[];
  totalHealthLost: number;

  constructor(maxHealth: number = 20) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.weaponCarried = null;
    this.weaponMaxMonsterValue = null;
    this.monstersDefeated = [];
    this.totalHealthLost = 0;
  }

  adjustHealth(amount: number): boolean {
    this.currentHealth += amount;

    if (amount < 0) {
      this.totalHealthLost += Math.abs(amount);
    }

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
    this.weaponMaxMonsterValue = monsterValue;
  }

  recordMonsterDefeat(monsterLevel: number): void {
    this.monstersDefeated.push(monsterLevel);
  }

  isDead(): boolean {
    return this.currentHealth <= 0;
  }
}
