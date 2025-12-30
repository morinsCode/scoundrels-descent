import { pool } from "../database.js"; // # database connection

type Highscore = {
  id: number;
  player_name: string;
  score: number;
  achieved_at: Date;
};

export type HighscoreAPI = {
  id: number;
  playerName: string;
  score: number;
  achievedAt: Date;
};

function mapRowToHighscore(row: Highscore): HighscoreAPI {
  return {
    id: row.id,
    playerName: row.player_name,
    score: row.score,
    achievedAt: row.achieved_at
  };
}

export async function getTopHighscores(limit: number): Promise<HighscoreAPI[]> {
  const result = await pool.query<Highscore>(
    `
        SELECT id, player_name, score, achieved_at
        FROM highscores
        ORDER BY score DESC, achieved_at ASC
        LIMIT $1
        `,
    [limit]
  );

  return result.rows.map(mapRowToHighscore);
}

export async function postHighscore(
  playerName: string,
  score: number
): Promise<void> {
  await pool.query(
    `
INSERT INTO highscores (player_name, score) VALUES ($1, $2);
`,
    [playerName, score]
  );
}
