import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { analyzeImage } from "@/lib/ai/gemini"
import { uploadBlob } from "@/lib/azure/blob"
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts/analyze"
import { badRequest, serverError } from "@/lib/utils/errors"
import { v4 as uuidv4 } from "uuid"

const ALLOWED_TYPES = ["image/jpeg", "image/png"]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    const personaId = formData.get("persona_id") as string | null

    if (!file) return badRequest("Image file is required")
    if (!personaId) return badRequest("persona_id is required")
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest("Image must be JPEG or PNG")
    }
    if (file.size > MAX_SIZE) {
      return badRequest("Image must be under 10 MB")
    }

    const imageBytes = Buffer.from(await file.arrayBuffer())

    // Upload to Blob Storage
    const blobName = `${personaId}/${uuidv4()}.${file.type === "image/png" ? "png" : "jpg"}`
    const sourceImageUrl = await uploadBlob("source-images", blobName, imageBytes, file.type)

    // Analyze with Gemini Flash
    const rawJson = await analyzeImage(ANALYZE_SYSTEM_PROMPT, imageBytes, file.type)
    const traitInputs = JSON.parse(rawJson)

    // Update persona
    await db
      .update(personas)
      .set({
        source_image_url: sourceImageUrl,
        trait_inputs: traitInputs,
        updated_at: new Date(),
      })
      .where(eq(personas.id, personaId))

    return NextResponse.json({
      source_image_url: sourceImageUrl,
      trait_inputs: traitInputs,
    })
  } catch (err) {
    console.error("POST /api/analyze error:", err)
    return serverError("Failed to analyze image")
  }
}
