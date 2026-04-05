import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas, generations, videoJobs } from "@/db/schema"
import { eq } from "drizzle-orm"
import { uploadBlob, generateSasUrl } from "@/lib/azure/blob"
import { submitFaceSwap } from "@/lib/ai/kling"
import { badRequest, notFound, serverError } from "@/lib/utils/errors"
import { v4 as uuidv4 } from "uuid"

const ALLOWED_VIDEO_TYPES = ["video/mp4"]
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File | null
    const personaId = formData.get("persona_id") as string | null

    if (!file) return badRequest("Video file is required")
    if (!personaId) return badRequest("persona_id is required")
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return badRequest("Video must be MP4")
    }
    if (file.size > MAX_VIDEO_SIZE) {
      return badRequest("Video must be under 100 MB")
    }

    // Verify persona is ready
    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, personaId))

    if (!persona) return notFound("Persona not found")
    if (persona.status !== "ready") {
      return badRequest("Persona must be finalized before video generation")
    }

    // Upload video to Blob Storage
    const videoBytes = Buffer.from(await file.arrayBuffer())
    const videoBlobName = `${personaId}/${uuidv4()}.mp4`
    await uploadBlob("videos-input", videoBlobName, videoBytes, "video/mp4")
    const inputVideoSas = generateSasUrl("videos-input", videoBlobName)

    // Generate SAS URL for the 9-grid reference
    const nineGridBlobName =
      persona.nine_grid_url!.split("/nine-grids/")[1]?.split("?")[0] ?? `${personaId}/nine-grid.png`
    const referenceImageSas = generateSasUrl("nine-grids", nineGridBlobName)

    // Create generation + video job records
    const [generation] = await db
      .insert(generations)
      .values({
        persona_id: personaId,
        type: "video",
        user_prompt: "Face-swap video generation",
        status: "pending",
      })
      .returning()

    const [videoJob] = await db
      .insert(videoJobs)
      .values({
        generation_id: generation.id,
        input_video_url: inputVideoSas,
        status: "submitted",
      })
      .returning()

    // Submit to Kling API
    try {
      const klingResult = await submitFaceSwap(referenceImageSas, inputVideoSas)
      await db
        .update(videoJobs)
        .set({ kling_task_id: klingResult.task_id, updated_at: new Date() })
        .where(eq(videoJobs.id, videoJob.id))
    } catch (klingErr) {
      await db
        .update(videoJobs)
        .set({ status: "failed", updated_at: new Date() })
        .where(eq(videoJobs.id, videoJob.id))
      await db
        .update(generations)
        .set({
          status: "failed",
          error_message: klingErr instanceof Error ? klingErr.message : "Kling API error",
        })
        .where(eq(generations.id, generation.id))
      throw klingErr
    }

    return NextResponse.json(
      {
        generation_id: generation.id,
        video_job_id: videoJob.id,
        status: "submitted",
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("POST /api/video/submit error:", err)
    return serverError("Failed to submit video job")
  }
}
