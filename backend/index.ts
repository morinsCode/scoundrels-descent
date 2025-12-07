import express from "express";
/* import { database } from "./database.ts"; */
import { pool } from "./database.js";
import type { QueryResult } from "pg";
import cardsRouter from "./routes/cardsRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/cards", cardsRouter);

// === DB TEST ENDPOINT ===
app.get("/api/db-test", async (req, res) => {
  try {
    const result: QueryResult<{ now: string }> = await pool.query(
      "SELECT NOW() as now"
    );

    res.json({
      status: "ok",
      now: result.rows[0]?.now //optional chaining in case of empty result
    });
  } catch (err) {
    console.error("Error in /db-test:", err);
    res.status(500).json({ status: "error" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
