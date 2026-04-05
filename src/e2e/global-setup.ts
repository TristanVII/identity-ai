import { execSync } from "child_process"
import type { FullConfig } from "@playwright/test"
import pg from "pg"

const CONTAINER_NAME = "personasync-test-pg"
const PG_PORT = 5433 // avoid conflict with any local 5432
const PG_USER = "testuser"
const PG_PASS = "testpass"
const PG_DB = "personasync_test"

export const DB_URL = `postgresql://${PG_USER}:${PG_PASS}@localhost:${PG_PORT}/${PG_DB}`

export default async function globalSetup(_config: FullConfig) {
  console.log("\n🐘  Starting test PostgreSQL container…")

  // Remove stale container if it exists
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: "ignore" })
  } catch {
    // fine if it doesn't exist
  }

  // Start a fresh Postgres container
  execSync(
    `docker run -d --name ${CONTAINER_NAME} ` +
      `-e POSTGRES_USER=${PG_USER} ` +
      `-e POSTGRES_PASSWORD=${PG_PASS} ` +
      `-e POSTGRES_DB=${PG_DB} ` +
      `-p ${PG_PORT}:5432 ` +
      `postgres:16-alpine`,
    { stdio: "inherit" }
  )

  // Set env var for the Next.js server and API request contexts
  process.env.DATABASE_URL = DB_URL

  // Wait for Postgres to be ready (max ~20s)
  console.log("   Waiting for PostgreSQL to accept connections…")
  const maxAttempts = 40
  for (let i = 0; i < maxAttempts; i++) {
    try {
      execSync(
        `docker exec ${CONTAINER_NAME} pg_isready -U ${PG_USER} -d ${PG_DB}`,
        { stdio: "ignore" }
      )
      break
    } catch {
      if (i === maxAttempts - 1) throw new Error("PostgreSQL did not become ready in time")
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  console.log("   ✅  PostgreSQL is ready")

  // Create tables directly so they exist before the webserver starts
  console.log("   📐  Creating database tables…")
  const pool = new pg.Pool({ connectionString: DB_URL })
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS personas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        source_image_url TEXT,
        nine_grid_url TEXT,
        hidden_metadata JSONB NOT NULL DEFAULT '{}',
        trait_inputs JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_personas_status ON personas(status);

      CREATE TABLE IF NOT EXISTS generations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id UUID NOT NULL REFERENCES personas(id),
        type TEXT NOT NULL,
        user_prompt TEXT NOT NULL,
        merged_prompt TEXT,
        result_url TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        error_message TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_generations_persona ON generations(persona_id);
      CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);

      CREATE TABLE IF NOT EXISTS video_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        generation_id UUID NOT NULL UNIQUE REFERENCES generations(id),
        kling_task_id TEXT,
        input_video_url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'submitted',
        progress INTEGER NOT NULL DEFAULT 0,
        result_video_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_jobs(status);
    `)
    console.log("   ✅  Tables created\n")
  } finally {
    client.release()
    await pool.end()
  }
}
