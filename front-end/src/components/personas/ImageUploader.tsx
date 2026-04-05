"use client"

import { useCallback, useState } from "react"

interface ImageUploaderProps {
  personaId: string
  onAnalyzed: (traitInputs: Record<string, unknown>, sourceImageUrl: string) => void
}

export function ImageUploader({ personaId, onAnalyzed }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setPreview(URL.createObjectURL(file))
      const formData = new FormData()
      formData.append("image", file)
      formData.append("persona_id", personaId)
      try {
        const res = await fetch("/api/analyze", { method: "POST", body: formData })
        if (!res.ok) throw new Error("Analysis failed")
        const data = await res.json()
        onAnalyzed(data.trait_inputs, data.source_image_url)
      } catch (err) {
        console.error(err)
        alert("Failed to analyze image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [personaId, onAnalyzed]
  )

  return (
    <div>
      <label style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 12 }}>
        Upload Reference Face
      </label>
      <div
        style={{
          border: "2px dashed var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.2s ease, background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)"
          e.currentTarget.style.background = "rgba(139,142,255,0.03)"
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
        onClick={() => document.getElementById("face-upload")?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" style={{ maxHeight: 200, margin: "0 auto", borderRadius: "var(--radius-lg)" }} />
        ) : (
          <div>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📸</p>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>
              Drag & drop a face image, or click to browse
            </p>
            <p style={{ color: "var(--text-subtle)", fontSize: "var(--text-micro)", marginTop: 4 }}>
              JPEG or PNG, max 10 MB
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          id="face-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
        />
      </div>
      {isUploading && (
        <p className="animate-pulse-subtle" style={{ fontSize: "var(--text-body-sm)", color: "var(--accent)", marginTop: 12, textAlign: "center" }}>
          Analyzing face…
        </p>
      )}
    </div>
  )
}
