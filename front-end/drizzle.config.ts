import { defineConfig } from "drizzle-kit"

const raw = process.env.ConnectionStrings__personasync || process.env.DATABASE_URL || ""

function toPostgresUri(conn: string): string {
  if (!conn || conn.startsWith("postgresql://") || conn.startsWith("postgres://")) return conn
  const parts = Object.fromEntries(
    conn.split(";").filter(Boolean).map((p) => {
      const idx = p.indexOf("=")
      return [p.slice(0, idx).trim().toLowerCase(), p.slice(idx + 1).trim()]
    })
  )
  const host = parts["host"] || parts["server"] || "localhost"
  const port = parts["port"] || "5432"
  const user = encodeURIComponent(parts["username"] || parts["user id"] || "postgres")
  const pass = encodeURIComponent(parts["password"] || "")
  const db = parts["database"] || parts["initial catalog"] || "postgres"
  return `postgresql://${user}:${pass}@${host}:${port}/${db}`
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: toPostgresUri(raw),
  },
})
