import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { videoJobs, generations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getTaskStatus } from "@/lib/ai/kling"
import { uploadBlob } from "@/lib/azure/blob"
import { notFound, serverError } from "@/lib/utils/errors"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params

    const [job] = await db
      .select()
      .from(videoJobs)
      .where(eq(videoJobs.id, jobId))

    if (!job) return notFound("Video job not found")

    // If still in progress, poll Kling for latest status
    if (job.kling_task_id && (job.status === "submitted" || job.status === "processing")) {
      try {
        const klingStatus = await getTaskStatus(job.kling_task_id)

        const updates: Record<string, unknown> = {
          status: klingStatus.status,
          progress: klingStatus.progress,
          updated_at: new Date(),
        }

        // If completed, download and re-upload the result video
        if (klingStatus.status === "completed" && klingStatus.result_video_url) {
          const videoResponse = await fetch(klingStatus.result_video_url)
          const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())
          const blobName = `${job.generation_id}/${jobId}-result.mp4`
          const resultUrl = await uploadBlob("videos-output", blobName, videoBuffer, "video/mp4")
          updates.result_video_url = resultUrl

          // Also update the parent generation
          await db
            .update(generations)
            .set({ result_url: resultUrl, status: "completed" })
            .where(eq(generations.id, job.generation_id))
        }

        if (klingStatus.status === "failed") {
          await db
            .update(generations)
            .set({
              status: "failed",
              error_message: klingStatus.error_message ?? "Video processing failed",
            })
            .where(eq(generations.id, job.generation_id))
        }

        await db
          .update(videoJobs)
          .set(updates)
          .where(eq(videoJobs.id, jobId))

        return NextResponse.json({
          video_job_id: jobId,
          status: klingStatus.status,
          progress: klingStatus.progress,
          result_video_url: updates.result_video_url ?? null,
        })
      } catch (pollErr) {
        console.error("Kling poll error:", pollErr)
        // Return last known state if polling fails
      }
    }

    return NextResponse.json({
      video_job_id: job.id,
      status: job.status,
      progress: job.progress,
      result_video_url: job.result_video_url,
    })
  } catch (err) {
    console.error("GET /api/video/status/[jobId] error:", err)
    return serverError("Failed to get video status")
  }
}
