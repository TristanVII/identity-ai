export type GenerationType = "image" | "video"
export type GenerationStatus = "pending" | "processing" | "completed" | "failed"
export type VideoJobStatus = "submitted" | "processing" | "completed" | "failed"

export interface Generation {
  id: string
  persona_id: string
  type: GenerationType
  user_prompt: string
  merged_prompt: string | null
  result_url: string | null
  status: GenerationStatus
  error_message: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface VideoJob {
  id: string
  generation_id: string
  kling_task_id: string | null
  input_video_url: string
  status: VideoJobStatus
  progress: number
  result_video_url: string | null
  created_at: string
  updated_at: string
}
