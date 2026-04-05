import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas, generations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateText } from "@/lib/ai/gemini"
import { generateImageWithReference } from "@/lib/ai/imagen"
import { uploadBlob, downloadBlob } from "@/lib/azure/blob"
import { MERGE_SYSTEM_PROMPT, buildMergeUserMessage } from "@/lib/prompts/merge"
import { badRequest, notFound, serverError } from "@/lib/utils/errors"
import { v4 as uuidv4 } from "uuid"
import type { HiddenMetadata } from "@/types/persona"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { persona_id, prompt } = body

    if (!persona_id) return badRequest("persona_id is required")
    if (!prompt || typeof prompt !== "string") return badRequest("prompt is required")

    // Fetch persona
    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, persona_id))

    if (!persona) return notFound("Persona not found")
    if (persona.status !== "ready") {
      return badRequest("Persona must be finalized before generating images")
    }

    const metadata = persona.hidden_metadata as HiddenMetadata

    // Create generation record
    const [generation] = await db
      .insert(generations)
      .values({
        persona_id,
        type: "image",
        user_prompt: prompt,
        status: "processing",
      })
      .returning()

    try {
      // Step 1: Merge prompts via Gemini
      const mergedPrompt = await generateText(
        MERGE_SYSTEM_PROMPT,
        buildMergeUserMessage(prompt, metadata.master_prompt_fragment)
      )

      // Step 2: Download 9-grid reference for Imagen
      const nineGridUrl = persona.nine_grid_url!
      const blobName = nineGridUrl.split("/nine-grids/")[1]?.split("?")[0] ?? `${persona_id}/nine-grid.png`
      const referenceBytes = await downloadBlob("nine-grids", blobName)

      // Step 3: Generate image with reference
      const result = await generateImageWithReference(
        mergedPrompt,
        referenceBytes,
        "image/png"
      )

      // Step 4: Upload result
      const resultBlobName = `${persona_id}/${uuidv4()}.png`
      const resultUrl = await uploadBlob(
        "generated-images",
        resultBlobName,
        result.imageBytes,
        "image/png"
      )

      // Step 5: Update generation
      await db
        .update(generations)
        .set({
          merged_prompt: mergedPrompt,
          result_url: resultUrl,
          status: "completed",
        })
        .where(eq(generations.id, generation.id))

      return NextResponse.json({
        generation_id: generation.id,
        status: "completed",
        result_url: resultUrl,
      })
    } catch (genErr) {
      await db
        .update(generations)
        .set({
          status: "failed",
          error_message: genErr instanceof Error ? genErr.message : "Unknown error",
        })
        .where(eq(generations.id, generation.id))
      throw genErr
    }
  } catch (err) {
    console.error("POST /api/generate error:", err)
    return serverError("Failed to generate image")
  }
}
