import { NextResponse } from "next/server"
import { generateText } from "@/lib/ai/gemini"
import { generateImage } from "@/lib/ai/imagen"
import { badRequest, serverError } from "@/lib/utils/errors"

const PREVIEW_SYSTEM_PROMPT = `You are a prompt engineer. Given a JSON object of facial traits, produce a single concise prompt for an AI image generator to create a photorealistic neutral headshot portrait of this person. The prompt should be under 200 words. Include all key facial features. Output only the prompt text, nothing else.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { persona_id, trait_inputs } = body

    if (!persona_id) return badRequest("persona_id is required")
    if (!trait_inputs || typeof trait_inputs !== "object") {
      return badRequest("trait_inputs is required")
    }

    // Convert traits to image prompt via Gemini
    const imagePrompt = await generateText(
      PREVIEW_SYSTEM_PROMPT,
      JSON.stringify(trait_inputs)
    )

    // Generate preview image via Imagen 3
    const result = await generateImage(imagePrompt)

    return NextResponse.json({
      image_base64: result.imageBytes.toString("base64"),
      mime_type: result.mimeType,
    })
  } catch (err) {
    console.error("POST /api/preview error:", err)
    return serverError("Failed to generate preview")
  }
}
