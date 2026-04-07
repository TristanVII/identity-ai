import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { analyzeImagesToBlueprint } from "@/lib/ai/gemini"
import type { ImageInput } from "@/lib/ai/gemini"
import { uploadBlob } from "@/lib/azure/blob"
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts/analyze"
import { badRequest, serverError } from "@/lib/utils/errors"
import { v4 as uuidv4 } from "uuid"

const ALLOWED_TYPES = ["image/jpeg", "image/png"]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_IMAGES = 3

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const personaId = formData.get("persona_id") as string | null
    if (!personaId) return badRequest("persona_id is required")

    // Collect all images from formData (image_0, image_1, image_2 or single "image")
    const files: File[] = []
    for (let i = 0; i < MAX_IMAGES; i++) {
      const f = formData.get(`image_${i}`) as File | null
      if (f) files.push(f)
    }
    // Fallback: single "image" field for backward compat
    if (files.length === 0) {
      const single = formData.get("image") as File | null
      if (single) files.push(single)
    }

    if (files.length === 0) return badRequest("At least one image is required")

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return badRequest(`Image must be JPEG or PNG (got ${file.type})`)
      }
      if (file.size > MAX_SIZE) {
        return badRequest("Each image must be under 10 MB")
      }
    }

    // Upload all to blob storage in parallel
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const imageBytes = Buffer.from(await file.arrayBuffer())
        const ext = file.type === "image/png" ? "png" : "jpg"
        const blobName = `${personaId}/${uuidv4()}.${ext}`
        const url = await uploadBlob("source-images", blobName, imageBytes, file.type)
        return { url, data: imageBytes, mimeType: file.type }
      })
    )

    const sourceImageUrls = uploadResults.map((r) => r.url)
    const imageInputs: ImageInput[] = uploadResults.map((r) => ({
      data: r.data,
      mimeType: r.mimeType,
    }))

    // Analyze all images with Gemini in one call
    const blueprint = await analyzeImagesToBlueprint(ANALYZE_SYSTEM_PROMPT, imageInputs, { caller: "api/analyze", persona_id: personaId })

    // Store first image as primary source_image_url for backward compat
    await db
      .update(personas)
      .set({
        source_image_url: sourceImageUrls[0],
        hidden_metadata: { ...blueprint, _reference_images: sourceImageUrls },
        updated_at: new Date(),
      })
      .where(eq(personas.id, personaId))

    return NextResponse.json({
      source_image_urls: sourceImageUrls,
      blueprint,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("POST /api/analyze error:", err)
    return serverError(message)
  }
}
