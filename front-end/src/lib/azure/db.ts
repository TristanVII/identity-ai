import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "@/db/schema"

// Aspire injects as ConnectionStrings__personasync; fall back to DATABASE_URL
const raw = process.env.ConnectionStrings__personasync || process.env.DATABASE_URL || ""

// Aspire's Azure Postgres injects ADO.NET format: Host=xxx;Port=5432;Username=...;Password=...;Database=...
// The pg library needs a postgresql:// URI — convert if needed
function toPostgresUri(conn: string): string {
  if (!conn || conn.startsWith("postgresql://") || conn.startsWith("postgres://")) {
    // Strip sslmode from URI for local dev (Docker Postgres has no SSL)
    if (process.env.NODE_ENV !== "production") {
      return conn.replace(/[?&]sslmode=[^&]*/gi, "")
    }
    return conn
  }
  // Parse ADO.NET key=value pairs (semicolon-separated)
  const parts = Object.fromEntries(
    conn.split(";").filter(Boolean).map((p) => {
      const idx = p.indexOf("=")
      return [p.slice(0, idx).trim().toLowerCase(), p.slice(idx + 1).trim()]
    })
  )
  const host = parts["host"] || parts["server"] || "localhost"
  const port = parts["port"] || "5432"
  const user = encodeURIComponent(parts["username"] || parts["user id"] || parts["uid"] || "postgres")
  const pass = encodeURIComponent(parts["password"] || "")
  const db = parts["database"] || parts["initial catalog"] || "postgres"
  // Intentionally omit SSL params — we control SSL via the Pool config below
  return `postgresql://${user}:${pass}@${host}:${port}/${db}`
}

const connectionString = toPostgresUri(raw)

if (!connectionString) {
  console.warn("⚠️  No database connection string found (ConnectionStrings__personasync or DATABASE_URL)")
}

export const pool = new Pool({
  connectionString,
  // Only use SSL in production (Azure requires it; local Docker Postgres does not support it)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool, { schema })
