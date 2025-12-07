/* import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const connectionString = process.env.PGURI;

if (!connectionString) {
  throw new Error("PGURI is not set in .env");
}

export const database = new Client({ connectionString });

database
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL (Express)");
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL", err);
  }); */

// # CHANED TO USE POOL INSTEAD OF CLIENT

import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.PGURI;

if (!connectionString) {
  throw new Error("PGURI is not set in .env");
}

export const pool = new Pool({ connectionString }); // # Changed from database/Client

// # Optional: Listen for pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// # Pool auto-connects, but you can test the connection:
pool
  .query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL (Express)"))
  .catch((err) => console.error("Failed to connect to PostgreSQL", err));
