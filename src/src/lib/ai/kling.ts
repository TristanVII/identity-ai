const KLING_BASE_URL = process.env.KLING_API_BASE_URL || "https://api.klingai.com"

function getHeaders() {
  const apiKey = process.env.KLING_API_KEY
  if (!apiKey) throw new Error("KLING_API_KEY is not set")
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }
}

export interface KlingSubmitResult {
  task_id: string
}

export interface KlingStatusResult {
  task_id: string
  status: "submitted" | "processing" | "completed" | "failed"
  progress: number
  result_video_url: string | null
  error_message: string | null
}

export async function submitFaceSwap(
  referenceImageUrl: string,
  inputVideoUrl: string
): Promise<KlingSubmitResult> {
  const response = await fetch(`${KLING_BASE_URL}/v1/face-swap`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      reference_image_url: referenceImageUrl,
      input_video_url: inputVideoUrl,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Kling API error ${response.status}: ${body}`)
  }

  const data = await response.json()
  return { task_id: data.task_id }
}

export async function getTaskStatus(taskId: string): Promise<KlingStatusResult> {
  const response = await fetch(`${KLING_BASE_URL}/v1/tasks/${taskId}`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Kling API error ${response.status}: ${body}`)
  }

  const data = await response.json()
  return {
    task_id: data.task_id,
    status: data.status,
    progress: data.progress ?? 0,
    result_video_url: data.result_video_url ?? null,
    error_message: data.error_message ?? null,
  }
}
