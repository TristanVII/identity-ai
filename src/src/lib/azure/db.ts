import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "@/db/schema"

// Aspire injects as ConnectionStrings__personasync; fall back to DATABASE_URL
const connectionString =
  process.env.ConnectionStrings__personasync || process.env.DATABASE_URL

if (!connectionString) {
  console.warn("⚠️  No database connection string found (ConnectionStrings__personasync or DATABASE_URL)")
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
})

export const db = drizzle(pool, { schema })
