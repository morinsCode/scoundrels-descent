import dotenv from "dotenv";
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
  });
