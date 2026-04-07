import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas, generations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateText } from "@/lib/ai/gemini"
import { generateImageWithReference, editImageWithReference, editWithAnnotation } from "@/lib/ai/imagen"
import { uploadBlob, downloadBlob } from "@/lib/azure/blob"
import { MERGE_SYSTEM_PROMPT, buildMergeUserMessage } from "@/lib/prompts/merge"
import { badRequest, notFound, serverError } from "@/lib/utils/errors"
import { v4 as uuidv4 } from "uuid"
import type { HiddenMetadata } from "@/types/persona"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      persona_id,
      prompt,
      previous_image_url,
      annotated_image,
      faceswap_image,
      aspect_ratio,
      image_size,
    } = body

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
    const imageOptions = {
      aspectRatio: aspect_ratio || "1:1",
      imageSize: image_size || "1K",
    }

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
      const isFaceSwap = !!faceswap_image && prompt === "__faceswap__"
      const isAnnotatedEdit = !isFaceSwap && !!annotated_image && !!previous_image_url
      const isPlainEdit = !isFaceSwap && !annotated_image && !!previous_image_url

      const logCtx = { caller: "api/generate", persona_id }

      // Download nine-grid reference (used in all paths)
      const nineGridUrl = persona.nine_grid_url!
      const blobName = nineGridUrl.split("/nine-grids/")[1]?.split("?")[0] ?? `${persona_id}/nine-grid.png`
      const referenceBytes = await downloadBlob("nine-grids", blobName)

      let finalPrompt: string
      let result

      if (isFaceSwap) {
        // Scene recreation: generate the persona in the same scene/pose as the uploaded photo.
        // Keep prompt short and natural — no identity/face manipulation language.
        finalPrompt = [
          "Using the second image as a reference for the person's appearance,",
          "generate a new photorealistic photograph that recreates the exact scene from the first image with that person.",
          "Match the pose, angle, clothing style, background, and lighting precisely.",
        ].join(" ")

        const swapBase64 = faceswap_image.replace(/^data:image\/\w+;base64,/, "")
        const swapBytes = Buffer.from(swapBase64, "base64")

        result = await editImageWithReference(
          finalPrompt,
          swapBytes,
          "image/png",
          referenceBytes,
          "image/png",
          { ...imageOptions, allowText: true },
          logCtx
        )
      } else if (isAnnotatedEdit) {
        // Region edit: user circled something and wants a targeted change.
        // DO NOT re-merge with character description — the images provide all context.
        finalPrompt = [
          "Edit this image. The first image shows the area I want changed — it is highlighted with a circle and the rest is dimmed.",
          "The second image is the clean original.",
          "The third image is a character reference sheet — keep the character's face and appearance consistent with it.",
          `My edit instruction: ${prompt}`,
          "IMPORTANT: ONLY change what I asked for inside the circled area. Everything else must remain EXACTLY the same — same composition, same background, same colors, same lighting. Output the full edited image.",
        ].join("\n")

        const annotatedBase64 = annotated_image.replace(/^data:image\/\w+;base64,/, "")
        const annotatedBytes = Buffer.from(annotatedBase64, "base64")

        const prevPath = previous_image_url.replace("/api/blobs/", "")
        const slashIdx = prevPath.indexOf("/")
        const container = prevPath.substring(0, slashIdx)
        const prevBlobName = prevPath.substring(slashIdx + 1)
        const cleanBytes = await downloadBlob(container as "source-images" | "generated-images" | "nine-grids", prevBlobName)

        result = await editWithAnnotation(
          finalPrompt,
          annotatedBytes,
          "image/png",
          cleanBytes,
          "image/png",
          referenceBytes,
          "image/png",
          imageOptions,
          logCtx
        )
      } else if (isPlainEdit) {
        // Full-image edit: user wants to refine the whole image.
        // Send the user's instruction directly — the source image IS the context.
        finalPrompt = [
          "Edit this image.",
          "The first image is what I want you to modify.",
          "The second image is a character reference sheet — keep the character's face and appearance consistent with it.",
          `My edit instruction: ${prompt}`,
          "Make ONLY the requested change. Keep everything else exactly the same — same composition, same background, same pose unless I asked to change it.",
        ].join("\n")

        const prevPath = previous_image_url.replace("/api/blobs/", "")
        const slashIdx = prevPath.indexOf("/")
        const container = prevPath.substring(0, slashIdx)
        const prevBlobName = prevPath.substring(slashIdx + 1)
        const sourceBytes = await downloadBlob(container as "source-images" | "generated-images" | "nine-grids", prevBlobName)

        result = await editImageWithReference(
          finalPrompt,
          sourceBytes,
          "image/png",
          referenceBytes,
          "image/png",
          imageOptions,
          logCtx
        )
      } else {
        // First generation: merge user scenario with character description
        const mergedPrompt = await generateText(
          MERGE_SYSTEM_PROMPT,
          buildMergeUserMessage(prompt, metadata.master_prompt_fragment),
          logCtx
        )
        finalPrompt = mergedPrompt

        result = await generateImageWithReference(
          finalPrompt,
          referenceBytes,
          "image/png",
          imageOptions,
          logCtx
        )
      }

      // Upload result
      const resultBlobName = `${persona_id}/${uuidv4()}.png`
      const resultUrl = await uploadBlob(
        "generated-images",
        resultBlobName,
        result.imageBytes,
        "image/png"
      )

      // Update generation
      await db
        .update(generations)
        .set({
          merged_prompt: finalPrompt,
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
