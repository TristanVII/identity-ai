import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateText } from "@/lib/ai/gemini"
import { generateImage } from "@/lib/ai/imagen"
import { uploadBlob } from "@/lib/azure/blob"
import { FINALIZE_SYSTEM_PROMPT } from "@/lib/prompts/finalize"
import { NINE_GRID_VARIANTS, buildNineGridPrompt } from "@/lib/prompts/nine-grid"
import { compositeNineGrid } from "@/lib/utils/image-grid"
import { badRequest, notFound, serverError } from "@/lib/utils/errors"
import type { HiddenMetadata } from "@/types/persona"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { persona_id } = body

    if (!persona_id) return badRequest("persona_id is required")

    // Fetch persona
    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, persona_id))

    if (!persona) return notFound("Persona not found")

    // Set status to finalizing
    await db
      .update(personas)
      .set({ status: "finalizing", updated_at: new Date() })
      .where(eq(personas.id, persona_id))

    try {
      // Step 1: Generate hidden metadata JSON via Gemini
      const rawJson = await generateText(
        FINALIZE_SYSTEM_PROMPT,
        JSON.stringify(persona.trait_inputs)
      )
      const hiddenMetadata: HiddenMetadata = JSON.parse(rawJson)

      // Step 2: Generate 9-grid images
      const imagePromises = NINE_GRID_VARIANTS.map((variant) => {
        const prompt = buildNineGridPrompt(hiddenMetadata.master_prompt_fragment, variant)
        return generateImage(prompt)
      })
      const imageResults = await Promise.all(imagePromises)

      // Step 3: Composite into a single grid
      const gridBuffer = await compositeNineGrid(
        imageResults.map((r) => r.imageBytes)
      )

      // Step 4: Upload grid to Blob Storage
      const blobName = `${persona_id}/nine-grid.png`
      const nineGridUrl = await uploadBlob("nine-grids", blobName, gridBuffer, "image/png")

      // Step 5: Update persona with metadata and grid URL
      await db
        .update(personas)
        .set({
          hidden_metadata: hiddenMetadata,
          nine_grid_url: nineGridUrl,
          status: "ready",
          updated_at: new Date(),
        })
        .where(eq(personas.id, persona_id))

      return NextResponse.json({
        persona_id,
        status: "ready",
        nine_grid_url: nineGridUrl,
      })
    } catch (innerErr) {
      // Mark as error if finalization fails
      await db
        .update(personas)
        .set({ status: "error", updated_at: new Date() })
        .where(eq(personas.id, persona_id))
      throw innerErr
    }
  } catch (err) {
    console.error("POST /api/finalize error:", err)
    return serverError("Failed to finalize persona")
  }
}
