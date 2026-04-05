import type { Persona, TraitInputs } from "./persona"
import type { GenerationStatus, VideoJobStatus } from "./generation"

// -- Error response (all endpoints) --
export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// -- Personas --
export interface ListPersonasResponse {
  personas: Pick<Persona, "id" | "name" | "nine_grid_url" | "status" | "created_at">[]
}

export interface CreatePersonaRequest {
  name: string
}

export interface UpdatePersonaRequest {
  name?: string
  trait_inputs?: TraitInputs
}

// -- Analyze --
export interface AnalyzeResponse {
  source_image_url: string
  trait_inputs: TraitInputs
}

// -- Preview --
export interface PreviewRequest {
  persona_id: string
  trait_inputs: TraitInputs
}

export interface PreviewResponse {
  image_base64: string
  mime_type: string
}

// -- Finalize --
export interface FinalizeRequest {
  persona_id: string
}

export interface FinalizeResponse {
  persona_id: string
  status: "ready" | "error"
  nine_grid_url: string | null
}

// -- Generate --
export interface GenerateRequest {
  persona_id: string
  prompt: string
}

export interface GenerateResponse {
  generation_id: string
  status: GenerationStatus
  result_url: string | null
}

// -- Video --
export interface VideoSubmitResponse {
  generation_id: string
  video_job_id: string
  status: VideoJobStatus
}

export interface VideoStatusResponse {
  video_job_id: string
  status: VideoJobStatus
  progress: number
  result_video_url: string | null
}
