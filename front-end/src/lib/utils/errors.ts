import { NextResponse } from "next/server"
import type { ApiError } from "@/types/api"

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>
): NextResponse<ApiError> {
  return NextResponse.json(
    { error: { code, message, details } },
    { status }
  )
}

export function badRequest(message: string, details?: Record<string, unknown>) {
  return apiError("BAD_REQUEST", message, 400, details)
}

export function notFound(message: string) {
  return apiError("NOT_FOUND", message, 404)
}

export function serverError(message: string, details?: Record<string, unknown>) {
  return apiError("INTERNAL_ERROR", message, 500, details)
}
