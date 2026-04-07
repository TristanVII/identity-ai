"use client"

import { useCallback, useState } from "react"
import { Caption1, Spinner, makeStyles, tokens } from "@fluentui/react-components"
import { ArrowUpload24Regular } from "@fluentui/react-icons"

interface ImageUploaderProps {
  personaId: string
  onAnalyzed: (traitInputs: Record<string, unknown>, sourceImageUrl: string) => void
}

const useStyles = makeStyles({
  dropzone: {
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingVerticalXXL,
    textAlign: "center",
    cursor: "pointer",
    transitionProperty: "border-color, background-color",
    transitionDuration: tokens.durationNormal,
  },
  preview: {
    maxHeight: "200px",
    margin: "0 auto",
    borderRadius: tokens.borderRadiusLarge,
    display: "block",
  },
  uploading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
})

export function ImageUploader({ personaId, onAnalyzed }: ImageUploaderProps) {
  const styles = useStyles()
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
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          const msg = body?.error?.message ?? `Server error (${res.status})`
          throw new Error(msg)
        }
        const data = await res.json()
        onAnalyzed(data.blueprint, data.source_image_url)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        console.error("Image analysis failed:", message)
        alert(`Analysis failed: ${message}`)
      } finally {
        setIsUploading(false)
      }
    },
    [personaId, onAnalyzed]
  )

  return (
    <div>
      <div
        className={styles.dropzone}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tokens.colorBrandStroke1
          e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground1Hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = tokens.colorNeutralStroke2
          e.currentTarget.style.backgroundColor = "transparent"
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
          <img src={preview} alt="Preview" className={styles.preview} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <ArrowUpload24Regular style={{ color: tokens.colorNeutralForeground3 }} />
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
              Drag & drop a face image, or click to browse
            </Caption1>
            <Caption1 style={{ color: tokens.colorNeutralForeground4, fontSize: tokens.fontSizeBase100 }}>
              JPEG or PNG, max 10 MB
            </Caption1>
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
        <div className={styles.uploading}>
          <Spinner size="tiny" />
          <Caption1 style={{ color: tokens.colorBrandForeground1 }}>
            Analyzing face...
          </Caption1>
        </div>
      )}
    </div>
  )
}
