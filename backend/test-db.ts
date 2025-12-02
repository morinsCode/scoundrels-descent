// === TEST DB + env   ===
// in terminal run: npx tsx test-db.ts

import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const connectionString = process.env.PGURI;

if (!connectionString) {
  console.error("PGURI is not set in .env");
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    const result = await client.query("SELECT NOW() as now");
    console.log("Query result:", result.rows[0].now);
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await client.end();
  }
}

main();
