import { db } from "@/lib/azure/db"
import { aiLogs } from "@/db/schema"

export interface AiLogEntry {
  caller: string
  action: string
  model: string
  persona_id?: string
  prompt?: string
  parameters?: Record<string, unknown>
}

/**
 * Fire-and-forget: inserts an AI call log entry.
 * Never throws — errors are silently logged to console.
 */
export function logAiCall(entry: AiLogEntry): void {
  db.insert(aiLogs)
    .values({
      caller: entry.caller,
      action: entry.action,
      model: entry.model,
      persona_id: entry.persona_id ?? null,
      prompt: entry.prompt,
      parameters: entry.parameters ?? {},
    })
    .then(() => {})
    .catch((err) => {
      console.warn("[ai-log] Failed to write log:", err instanceof Error ? err.message : err)
    })
}
