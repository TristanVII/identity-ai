"use client"

import { useState, useEffect } from "react"
import type { VideoStatusResponse } from "@/types/api"

const POLL_INTERVAL_MS = 5000

export function useVideoJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<VideoStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) {
      setStatus(null)
      return
    }

    let active = true

    const poll = async () => {
      try {
        const res = await fetch(`/api/video/status/${jobId}`)
        if (!res.ok) throw new Error("Failed to fetch video status")
        const data: VideoStatusResponse = await res.json()
        if (active) setStatus(data)
        return data.status === "completed" || data.status === "failed"
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unknown error")
        return true // stop polling on error
      }
    }

    const interval = setInterval(async () => {
      const done = await poll()
      if (done) clearInterval(interval)
    }, POLL_INTERVAL_MS)

    // initial fetch
    poll()

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [jobId])

  return { status, error }
}
