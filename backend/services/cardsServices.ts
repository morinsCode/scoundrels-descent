// src/services/cardsService.ts
import { pool } from "../database.js"; // # your pg Pool setup

// # Two-Type System: Database vs. API
// #  separation  important because it allows each layer of application to follow its own naming conventions while maintaining type safety throughout the transformation process.

// # Raw DB row type (snake_case)
type CardRow = {
  id: number;
  name: string;
  level: number;
  card_type: string;
  image_url: string;
  description: string;
};

// # What you send to frontend (camelCase)
export type Card = {
  id: number;
  name: string;
  level: number;
  cardType: string;
  imageUrl: string;
  description: string;
};

// # Function to map DB row to API Card type
function mapRowToCard(row: CardRow): Card {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    cardType: row.card_type,
    imageUrl: row.image_url,
    description: row.description
  };
}

export async function getRandomDeck(limit: number): Promise<Card[]> {
  const result = await pool.query<CardRow>(
    `
    SELECT id, name, level, card_type, image_url, description
    FROM cards
    ORDER BY RANDOM()
    LIMIT $1
    `,
    [limit]
  );

  return result.rows.map(mapRowToCard);
}
