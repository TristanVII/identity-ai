import { NextResponse } from "next/server"
import { generateText } from "@/lib/ai/gemini"
import { generateImage, generateImageWithReference } from "@/lib/ai/imagen"
import { downloadBlob } from "@/lib/azure/blob"
import { badRequest, serverError } from "@/lib/utils/errors"

const PREVIEW_SYSTEM_PROMPT = `You are a prompt engineer. Given a JSON object describing a character's physical blueprint, produce a single concise prompt for an AI image generator to create a photorealistic neutral headshot portrait of this person. The prompt should be under 200 words. Include all key facial features, hair, skin tone, and distinguishing marks. Prioritize the must_keep_traits. Output only the prompt text, nothing else.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { persona_id, blueprint, reference_images } = body

    if (!persona_id) return badRequest("persona_id is required")
    if (!blueprint || typeof blueprint !== "object") {
      return badRequest("blueprint is required")
    }

    const logCtx = { caller: "api/preview", persona_id }

    // Convert blueprint to image prompt via Gemini
    const imagePrompt = await generateText(
      PREVIEW_SYSTEM_PROMPT,
      JSON.stringify(blueprint),
      logCtx
    )

    // Try to use first reference image for guided generation
    const refUrls = Array.isArray(reference_images) ? reference_images : []
    let result
    if (refUrls.length > 0 && refUrls[0].startsWith("/api/blobs/")) {
      try {
        const blobPath = refUrls[0].replace("/api/blobs/", "")
        const slashIdx = blobPath.indexOf("/")
        const container = blobPath.substring(0, slashIdx)
        const blobName = blobPath.substring(slashIdx + 1)
        const refBytes = await downloadBlob(container as "source-images", blobName)
        const mimeType = blobName.endsWith(".png") ? "image/png" : "image/jpeg"
        result = await generateImageWithReference(imagePrompt, refBytes, mimeType, undefined, logCtx)
      } catch (refErr) {
        console.warn("Failed to use reference image, falling back to text-only:", refErr)
        result = await generateImage(imagePrompt, undefined, logCtx)
      }
    } else {
      result = await generateImage(imagePrompt, undefined, logCtx)
    }

    return NextResponse.json({
      image_base64: result.imageBytes.toString("base64"),
      mime_type: result.mimeType,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("POST /api/preview error:", err)
    return serverError(message)
  }
}
