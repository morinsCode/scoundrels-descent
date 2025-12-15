// src/services/cardsService.ts
import { pool } from "../database.js"; // # database connection
// #  naming convention differences handled here

// # snake_case DB
type CardRow = {
  id: number;
  name: string;
  level: number;
  card_type: string;
  image_url: string;
  description: string;
};

// camelCase types for API
export type Card = {
  id: number;
  name: string;
  level: number;
  cardType: string;
  imageUrl: string;
  description: string;
};

// #  map DB to API
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
