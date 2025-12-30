import express from "express";

import { pool } from "./database.js";
import type { QueryResult } from "pg";
import cardsRouter from "./routes/cardsRoutes.js";
import highscoreRouter from "./routes/highscoreRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/cards", cardsRouter);
app.use("/api", highscoreRouter);

// === DB TEST ENDPOINT ===
app.get("/api/db-test", async (req, res) => {
  try {
    const result: QueryResult<{ now: string }> = await pool.query(
      "SELECT NOW() as now"
    );

    res.json({
      status: "ok",
      now: result.rows[0]?.now
    });
  } catch (err) {
    console.error("Error in /db-test:", err);
    res.status(500).json({ status: "error" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
