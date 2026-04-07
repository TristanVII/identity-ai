import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateText } from "@/lib/ai/gemini"
import { generateImage, generateImageWithReference } from "@/lib/ai/imagen"
import { downloadBlob, uploadBlob } from "@/lib/azure/blob"
import { NINE_GRID_VARIANTS, buildNineGridPrompt } from "@/lib/prompts/nine-grid"
import { compositeNineGrid } from "@/lib/utils/image-grid"
import { badRequest, notFound, serverError } from "@/lib/utils/errors"

const MASTER_PROMPT_SYSTEM = `You are a prompt engineer for a photorealistic AI image generation system.
Given a character blueprint JSON, produce a single dense paragraph (150-200 words) that describes this real person's exact physical appearance in natural language.
This description will be injected into prompts that generate photorealistic portrait photographs.
Use precise, unambiguous descriptors grounded in reality — describe them as a real human being, not a character or illustration.
Include all key facial features, bone structure, skin tone, hair, eyes, nose, mouth, and any distinguishing marks or asymmetries.
Prioritize features from the "must_keep_traits" list.
Do NOT use any artistic or stylistic language (no "illustration", "render", "artwork"). Describe purely physical attributes.
Output only the description text, nothing else.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { persona_id } = body

    if (!persona_id) return badRequest("persona_id is required")

    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, persona_id))

    if (!persona) return notFound("Persona not found")

    // Extract blueprint and reference images from hidden_metadata
    const metadata = (persona.hidden_metadata ?? {}) as Record<string, unknown>
    const { _reference_images, ...blueprint } = metadata
    const refImageUrls = Array.isArray(_reference_images) ? (_reference_images as string[]) : []

    if (Object.keys(blueprint).length === 0) {
      return badRequest("Persona has no blueprint data. Please fill in the character details first.")
    }

    // Set status to finalizing
    await db
      .update(personas)
      .set({ status: "finalizing", updated_at: new Date() })
      .where(eq(personas.id, persona_id))

    try {
      const logCtx = { caller: "api/finalize", persona_id }

      // Step 1: Generate master prompt from the full blueprint
      const masterPrompt = await generateText(
        MASTER_PROMPT_SYSTEM,
        JSON.stringify(blueprint),
        logCtx
      )

      // Step 2: Load first reference image (if any) for image-guided generation
      let refImageBytes: Buffer | null = null
      let refMimeType = "image/jpeg"
      if (refImageUrls.length > 0) {
        const refUrl = refImageUrls[0]
        // Reference URLs are /api/blobs/source-images/...
        if (refUrl.startsWith("/api/blobs/")) {
          const blobPath = refUrl.replace("/api/blobs/", "")
          const slashIdx = blobPath.indexOf("/")
          const container = blobPath.substring(0, slashIdx)
          const blobName = blobPath.substring(slashIdx + 1)
          refImageBytes = await downloadBlob(container as "source-images", blobName)
          refMimeType = blobName.endsWith(".png") ? "image/png" : "image/jpeg"
        }
      }

      // Step 3: Generate 9-grid images sequentially to avoid rate limits
      const imageResults: Awaited<ReturnType<typeof generateImage>>[] = []
      for (const variant of NINE_GRID_VARIANTS) {
        const prompt = buildNineGridPrompt(masterPrompt, variant)
        const result = refImageBytes
          ? await generateImageWithReference(prompt, refImageBytes, refMimeType, undefined, logCtx)
          : await generateImage(prompt, undefined, logCtx)
        imageResults.push(result)
      }

      // Step 4: Composite into a single grid
      const gridBuffer = await compositeNineGrid(
        imageResults.map((r) => r.imageBytes)
      )

      // Step 5: Upload grid to Blob Storage
      const blobName = `${persona_id}/nine-grid.png`
      const nineGridUrl = await uploadBlob("nine-grids", blobName, gridBuffer, "image/png")

      // Step 6: Update persona — keep blueprint, add master_prompt, set ready
      await db
        .update(personas)
        .set({
          hidden_metadata: { ...metadata, _master_prompt: masterPrompt },
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
      await db
        .update(personas)
        .set({ status: "error", updated_at: new Date() })
        .where(eq(personas.id, persona_id))
      throw innerErr
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("POST /api/finalize error:", err)
    return serverError(message)
  }
}
