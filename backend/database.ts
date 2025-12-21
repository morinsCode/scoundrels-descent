import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.PGURI;

if (!connectionString) {
  throw new Error("PGURI is not set in .env");
}

export const pool = new Pool({ connectionString });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL (Express)"))
  .catch((err) => console.error("Failed to connect to PostgreSQL", err));
