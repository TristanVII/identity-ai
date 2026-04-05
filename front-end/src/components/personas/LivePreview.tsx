"use client"

import { useState } from "react"
import type { TraitInputs } from "@/types/persona"

interface LivePreviewProps {
  personaId: string
  traitInputs: TraitInputs
}

export function LivePreview({ personaId, traitInputs }: LivePreviewProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handlePreview() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: personaId, trait_inputs: traitInputs }),
      })
      if (!res.ok) throw new Error("Preview failed")
      const data = await res.json()
      setPreviewSrc(`data:${data.mime_type};base64,${data.image_base64}`)
    } catch {
      alert("Failed to generate preview.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: "var(--text-overline)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-subtle)" }}>
          Preview
        </p>
        <button
          onClick={handlePreview}
          disabled={isLoading}
          style={{
            padding: "6px 16px",
            fontSize: "var(--text-micro)",
            fontWeight: 600,
            borderRadius: "var(--radius-full)",
            background: "var(--accent-muted)",
            color: "var(--accent)",
            border: "none",
            cursor: isLoading ? "wait" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {isLoading ? "Generating…" : "Generate Preview"}
        </button>
      </div>
      <div
        style={{
          aspectRatio: "1",
          background: "var(--bg-alt)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {previewSrc ? (
          <img src={previewSrc} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "var(--text-subtle)", fontSize: "var(--text-body-sm)", padding: 24, textAlign: "center" }}>
            Click &quot;Generate Preview&quot; to see your character
          </span>
        )}
      </div>
    </div>
  )
}
