import { pool } from "./src/lib/azure/db"

export async function register() {
  // Only run on the Node.js server runtime, not Edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await ensureTables()
    } catch (err) {
      console.warn("⚠️  Could not connect to database on startup — tables will be created on first successful connection")
      console.warn("   ", (err as Error).message)
    }
  }
}

async function ensureTables() {
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
    console.log("✅  Database tables ensured")
  } catch (err) {
    console.error("⚠️  Failed to ensure database tables:", err)
  } finally {
    client.release()
  }
}
