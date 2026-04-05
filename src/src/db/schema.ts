import { pgTable, uuid, text, jsonb, timestamp, integer, index } from "drizzle-orm/pg-core"

export const personas = pgTable(
  "personas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    source_image_url: text("source_image_url"),
    nine_grid_url: text("nine_grid_url"),
    hidden_metadata: jsonb("hidden_metadata").notNull().default({}),
    trait_inputs: jsonb("trait_inputs").notNull().default({}),
    status: text("status").notNull().default("draft"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_personas_status").on(table.status),
  ]
)

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    persona_id: uuid("persona_id")
      .notNull()
      .references(() => personas.id),
    type: text("type").notNull(), // "image" | "video"
    user_prompt: text("user_prompt").notNull(),
    merged_prompt: text("merged_prompt"),
    result_url: text("result_url"),
    status: text("status").notNull().default("pending"),
    error_message: text("error_message"),
    metadata: jsonb("metadata").default({}),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_generations_persona").on(table.persona_id),
    index("idx_generations_status").on(table.status),
  ]
)

export const videoJobs = pgTable(
  "video_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    generation_id: uuid("generation_id")
      .notNull()
      .unique()
      .references(() => generations.id),
    kling_task_id: text("kling_task_id"),
    input_video_url: text("input_video_url").notNull(),
    status: text("status").notNull().default("submitted"),
    progress: integer("progress").notNull().default(0),
    result_video_url: text("result_video_url"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_video_jobs_status").on(table.status),
  ]
)
