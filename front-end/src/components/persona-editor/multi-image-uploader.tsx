"use client"

import { useCallback, useRef, useState } from "react"
import {
  Button,
  Caption1,
  Body1,
  Spinner,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  ArrowUpload24Regular,
  Dismiss16Regular,
  Send24Regular,
} from "@fluentui/react-icons"

interface MultiImageUploaderProps {
  personaId: string
  onAnalyzed: (blueprint: Record<string, unknown>, sourceImageUrls: string[]) => void
}

const MAX_IMAGES = 3

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  description: {
    color: tokens.colorNeutralForeground3,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: tokens.spacingHorizontalS,
  },
  slot: {
    aspectRatio: "3/4",
    borderRadius: tokens.borderRadiusLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
    transitionProperty: "border-color, background-color",
    transitionDuration: tokens.durationNormal,
  },
  slotFilled: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
  slotImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: "4px",
    right: "4px",
    minWidth: "20px",
    width: "20px",
    height: "20px",
    padding: "0",
  },
  slotPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalS,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
  },
  analyzing: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    justifyContent: "center",
    padding: tokens.spacingVerticalM,
  },
})

export function MultiImageUploader({ personaId, onAnalyzed }: MultiImageUploaderProps) {
  const styles = useStyles()
  const [files, setFiles] = useState<(File | null)[]>([null, null, null])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const addFile = useCallback((index: number, file: File) => {
    setFiles((prev) => {
      const next = [...prev]
      next[index] = file
      return next
    })
    setPreviews((prev) => {
      const next = [...prev]
      if (next[index]) URL.revokeObjectURL(next[index]!)
      next[index] = URL.createObjectURL(file)
      return next
    })
    setError(null)
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
    setPreviews((prev) => {
      const next = [...prev]
      if (next[index]) URL.revokeObjectURL(next[index]!)
      next[index] = null
      return next
    })
  }, [])

  const imageCount = files.filter(Boolean).length

  const handleSubmit = useCallback(async () => {
    const activeFiles = files.filter((f): f is File => f !== null)
    if (activeFiles.length === 0) return

    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    formData.append("persona_id", personaId)
    activeFiles.forEach((file, i) => {
      formData.append(`image_${i}`, file)
    })

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const msg = body?.error?.message ?? `Server error (${res.status})`
        throw new Error(msg)
      }
      const data = await res.json()
      onAnalyzed(data.blueprint, data.source_image_urls)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      console.error("Image analysis failed:", message)
      setError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }, [files, personaId, onAnalyzed])

  return (
    <div className={styles.root}>
      <Caption1 className={styles.description}>
        Upload up to {MAX_IMAGES} reference photos of the same person. Multiple angles help produce a more accurate blueprint.
      </Caption1>

      <div className={styles.grid}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles.slot} ${previews[i] ? styles.slotFilled : ""}`}
            onMouseEnter={(e) => {
              if (!previews[i]) {
                e.currentTarget.style.borderColor = tokens.colorBrandStroke1
                e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground1Hover
              }
            }}
            onMouseLeave={(e) => {
              if (!previews[i]) {
                e.currentTarget.style.borderColor = tokens.colorNeutralStroke2
                e.currentTarget.style.backgroundColor = "transparent"
              }
            }}
            onClick={() => {
              if (!previews[i] && !isAnalyzing) inputRefs[i].current?.click()
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file && !isAnalyzing) addFile(i, file)
            }}
          >
            {previews[i] ? (
              <>
                <img src={previews[i]!} alt={`Reference ${i + 1}`} className={styles.slotImage} />
                {!isAnalyzing && (
                  <Button
                    className={styles.removeBtn}
                    appearance="primary"
                    size="small"
                    icon={<Dismiss16Regular />}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(i)
                    }}
                  />
                )}
              </>
            ) : (
              <div className={styles.slotPlaceholder}>
                <ArrowUpload24Regular style={{ color: tokens.colorNeutralForeground4 }} />
                <Caption1 style={{ color: tokens.colorNeutralForeground4, textAlign: "center" }}>
                  {i === 0 ? "Front" : i === 1 ? "Side" : "Other"}
                </Caption1>
              </div>
            )}
            <input
              ref={inputRefs[i]}
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) addFile(i, file)
                e.target.value = ""
              }}
            />
          </div>
        ))}
      </div>

      {error && (
        <Caption1 style={{ color: tokens.colorPaletteRedForeground1 }}>
          {error}
        </Caption1>
      )}

      {isAnalyzing ? (
        <div className={styles.analyzing}>
          <Spinner size="tiny" />
          <Body1 style={{ color: tokens.colorBrandForeground1 }}>
            Analyzing {imageCount} {imageCount === 1 ? "image" : "images"}...
          </Body1>
        </div>
      ) : (
        <div className={styles.footer}>
          <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
            {imageCount} of {MAX_IMAGES} slots used
          </Caption1>
          <Button
            appearance="primary"
            icon={<Send24Regular />}
            disabled={imageCount === 0}
            onClick={handleSubmit}
          >
            Analyze
          </Button>
        </div>
      )}
    </div>
  )
}
