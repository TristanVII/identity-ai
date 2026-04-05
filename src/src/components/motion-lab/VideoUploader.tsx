"use client"

import { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useVideoJobStatus } from "@/lib/hooks/use-video-status"

export function VideoUploader() {
  const searchParams = useSearchParams()
  const personaId = searchParams.get("persona")
  const [jobId, setJobId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { status } = useVideoJobStatus(jobId)

  const handleUpload = useCallback(
    async (file: File) => {
      if (!personaId) return
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("video", file)
      formData.append("persona_id", personaId)
      try {
        const res = await fetch("/api/video/submit", { method: "POST", body: formData })
        if (!res.ok) throw new Error("Submit failed")
        const data = await res.json()
        setJobId(data.video_job_id)
      } catch (err) {
        console.error(err)
        alert("Failed to submit video.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [personaId]
  )

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    padding: "clamp(1.5rem, 3vw, 2.5rem)",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Upload zone */}
      <div style={cardStyle}>
        <div
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: 40,
            textAlign: "center",
            cursor: personaId ? "pointer" : "default",
            transition: "border-color 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (personaId) {
              e.currentTarget.style.borderColor = "var(--accent)"
              e.currentTarget.style.background = "rgba(139,142,255,0.03)"
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)"
            e.currentTarget.style.background = "transparent"
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) handleUpload(file)
          }}
          onClick={() => personaId && document.getElementById("video-upload")?.click()}
        >
          <p style={{ fontSize: 32, marginBottom: 8 }}>{"\uD83C\uDFAC"}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>
            {personaId
              ? "Drag & drop a reference video (MP4, max 100 MB)"
              : "Select a persona from the sidebar first"}
          </p>
          <input
            type="file"
            accept="video/mp4"
            id="video-upload"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />
          {personaId && (
            <button
              disabled={isSubmitting}
              style={{
                marginTop: 16,
                padding: "8px 20px",
                fontSize: "var(--text-body-sm)",
                fontWeight: 600,
                borderRadius: "var(--radius-full)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                cursor: isSubmitting ? "wait" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {isSubmitting ? "Uploading\u2026" : "Choose Video"}
            </button>
          )}
        </div>
      </div>

      {/* Job status */}
      {status && (
        <div className="animate-fade-up" style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 600 }}>Video Processing</h3>
            <span
              style={{
                fontSize: "var(--text-micro)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background:
                  status.status === "completed"
                    ? "var(--accent-muted)"
                    : status.status === "failed"
                      ? "rgba(255,107,107,0.15)"
                      : "rgba(255,255,255,0.06)",
                color:
                  status.status === "completed"
                    ? "var(--accent)"
                    : status.status === "failed"
                      ? "var(--destructive)"
                      : "var(--text-subtle)",
              }}
            >
              {status.status}
            </span>
          </div>

          {(status.status === "submitted" || status.status === "processing") && (
            <div>
              <div style={{ height: 4, background: "var(--bg-alt)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "var(--accent)",
                    borderRadius: "var(--radius-full)",
                    width: `${status.progress}%`,
                    transition: "width 0.5s var(--ease-out-expo)",
                  }}
                />
              </div>
              <p style={{ fontSize: "var(--text-micro)", color: "var(--text-subtle)", textAlign: "right", marginTop: 8 }}>
                {status.progress}%
              </p>
            </div>
          )}

          {status.status === "completed" && status.result_video_url && (
            <div>
              <video src={status.result_video_url} controls style={{ width: "100%", borderRadius: "var(--radius-lg)" }} />
              <a
                href={status.result_video_url}
                download
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 12,
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                Download Video &rarr;
              </a>
            </div>
          )}

          {status.status === "failed" && (
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--destructive)" }}>
              Video processing failed. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
