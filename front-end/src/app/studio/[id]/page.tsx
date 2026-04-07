"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Button,
  Input,
  Badge,
  Spinner,
  Caption1,
  Subtitle2,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  ArrowLeft24Regular,
  Save24Regular,
  Checkmark24Regular,
  Image24Regular,
  Grid24Regular,
  Add16Regular,
  Dismiss12Regular,
} from "@fluentui/react-icons"
import { ControlPanel } from "@/components/persona-editor/control-panel"
import type { CharacterBlueprint } from "@/types/character-blueprint"
import { DEFAULT_CHARACTER_BLUEPRINT } from "@/types/character-blueprint-defaults"

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 60px)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  headerRight: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },
  nameInput: {
    "& input": {
      fontSize: tokens.fontSizeBase500,
      fontWeight: tokens.fontWeightSemibold,
      letterSpacing: "-0.01em",
    },
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: tokens.spacingHorizontalL,
    gap: tokens.spacingVerticalM,
    overflow: "hidden",
  },
  previewCard: {
    flex: 1,
    minHeight: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: tokens.spacingHorizontalM,
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalS,
    flexShrink: 0,
  },
  cardLabel: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  previewBody: {
    flex: 1,
    minHeight: 0,
    borderRadius: tokens.borderRadiusLarge,
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  refCard: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: tokens.spacingHorizontalM,
  },
  refRow: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
  },
  refThumb: {
    width: "56px",
    height: "72px",
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground3,
    flexShrink: 0,
    position: "relative",
  },
  refThumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  refRemove: {
    position: "absolute",
    top: "2px",
    right: "2px",
    minWidth: "16px",
    width: "16px",
    height: "16px",
    padding: "0",
  },
  addRefSlot: {
    width: "56px",
    height: "72px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transitionProperty: "border-color",
    transitionDuration: tokens.durationNormal,
  },
  finalizingOverlay: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingVerticalM,
  },
})

export default function PersonaEditorPage() {
  const styles = useStyles()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [personaName, setPersonaName] = useState("")
  const [blueprint, setBlueprint] = useState<CharacterBlueprint>(DEFAULT_CHARACTER_BLUEPRINT)
  const [status, setStatus] = useState<string>("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [nineGridUrl, setNineGridUrl] = useState<string | null>(null)
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const addRefInput = useRef<HTMLInputElement>(null)
  const [isDirty, setIsDirty] = useState(false)
  const loadedRef = useRef(false)

  const hasAnalyzed = referenceImages.length > 0
  const isEditMode = status === "ready"

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/personas/" + id)
      const data = await res.json()
      setPersonaName(data.name)
      setStatus(data.status)
      setNineGridUrl(data.nine_grid_url)
      if (data.source_image_url) {
        setReferenceImages([data.source_image_url])
      }
      if (data.hidden_metadata) {
        const { _reference_images, ...rest } = data.hidden_metadata as Record<string, unknown>
        if (Array.isArray(_reference_images) && _reference_images.length > 0) {
          setReferenceImages(_reference_images as string[])
        }
        if (Object.keys(rest).length > 0) {
          setBlueprint(rest as unknown as CharacterBlueprint)
        }
      }
      loadedRef.current = true
    }
    load()
  }, [id])

  const handleAnalyzed = useCallback(
    (analyzedBlueprint: Record<string, unknown>, sourceImageUrls: string[]) => {
      setBlueprint(analyzedBlueprint as unknown as CharacterBlueprint)
      setReferenceImages(sourceImageUrls)
      setIsDirty(true)
    },
    []
  )

  const removeReference = useCallback((index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }, [])

  const addReference = useCallback(async (file: File) => {
    if (referenceImages.length >= 3) return
    const formData = new FormData()
    formData.append("image", file)
    formData.append("persona_id", id)
    const preview = URL.createObjectURL(file)
    setReferenceImages((prev) => [...prev, preview])
    setIsDirty(true)
  }, [referenceImages.length, id])

  const handleBlueprintChange = useCallback((b: CharacterBlueprint) => {
    setBlueprint(b)
    if (loadedRef.current) setIsDirty(true)
  }, [])

  async function handleSave() {
    setIsSaving(true)
    await fetch("/api/personas/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: personaName,
        hidden_metadata: { ...blueprint, _reference_images: referenceImages },
      }),
    })
    setIsSaving(false)
  }

  async function handleFinalize() {
    setIsFinalizing(true)
    setStatus("finalizing")
    try {
      // Save the blueprint first so finalize reads the latest data
      await fetch("/api/personas/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: personaName,
          hidden_metadata: { ...blueprint, _reference_images: referenceImages },
        }),
      })
      const res = await fetch("/api/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: id }),
      })
      const data = await res.json()
      if (data.status === "ready") {
        router.push("/studio")
      } else {
        setStatus(data.status)
        setNineGridUrl(data.nine_grid_url)
      }
    } catch {
      setStatus("error")
      alert("Finalization failed. Please try again.")
    } finally {
      setIsFinalizing(false)
    }
  }

  async function handleGeneratePreview() {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_id: id,
          blueprint,
          reference_images: referenceImages,
        }),
      })
      if (!res.ok) throw new Error("Preview failed")
      const data = await res.json()
      setPreviewSrc(`data:${data.mime_type};base64,${data.image_base64}`)
    } catch {
      alert("Failed to generate preview.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={() => router.push("/studio")}
          />
          <Input
            value={personaName}
            onChange={(_, d) => setPersonaName(d.value)}
            placeholder="Persona Name"
            appearance="underline"
            size="large"
            className={styles.nameInput}
            style={{ minWidth: 200 }}
          />
          {status !== "draft" && (
            <Badge
              appearance="filled"
              color={status === "ready" ? "success" : "brand"}
              size="medium"
            >
              {status}
            </Badge>
          )}
        </div>
        <div className={styles.headerRight}>
          <Button
            appearance="secondary"
            icon={<Save24Regular />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            appearance="primary"
            icon={isFinalizing ? undefined : <Checkmark24Regular />}
            onClick={handleFinalize}
            disabled={isFinalizing || (isEditMode && !isDirty)}
          >
            {isFinalizing ? "Generating 9-Grid..." : isEditMode ? "Re-generate 9-Grid" : "Save Persona"}
          </Button>
        </div>
      </div>

      {/* Body: sidebar + canvas */}
      <div className={styles.body}>
        <ControlPanel
          personaId={id}
          blueprint={blueprint}
          onChange={handleBlueprintChange}
          onAnalyzed={handleAnalyzed}
          hasAnalyzed={hasAnalyzed}
          isEditMode={isEditMode}
        />

        <main className={styles.canvas}>
          {/* Live Preview — takes remaining space */}
          <div className={styles.previewCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardLabel}>
                <Image24Regular />
                <Subtitle2>Live Preview</Subtitle2>
              </div>
              {!isEditMode && (
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={handleGeneratePreview}
                  disabled={isGenerating}
                  icon={isGenerating ? <Spinner size="tiny" /> : undefined}
                >
                  {isGenerating ? "Generating..." : "Generate Preview"}
                </Button>
              )}
            </div>
            <div className={styles.previewBody}>
              {status === "finalizing" ? (
                <div className={styles.finalizingOverlay}>
                  <Spinner size="medium" />
                  <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                    Generating 9-grid reference...
                  </Caption1>
                </div>
              ) : previewSrc ? (
                <img src={previewSrc} alt="Preview" className={styles.previewImg} />
              ) : nineGridUrl ? (
                <img src={nineGridUrl} alt="9-Grid" className={styles.previewImg} />
              ) : (
                <Caption1 style={{ padding: 24, textAlign: "center", color: tokens.colorNeutralForeground3 }}>
                  Click &quot;Generate Preview&quot; to see your character
                </Caption1>
              )}
            </div>
          </div>

          {/* Reference Images — compact strip at bottom */}
          <div className={styles.refCard}>
            <div className={styles.cardHeader} style={{ marginBottom: tokens.spacingVerticalXS }}>
              <div className={styles.cardLabel}>
                <Image24Regular />
                <Caption1 style={{ fontWeight: tokens.fontWeightSemibold }}>Reference Images</Caption1>
              </div>
              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                {referenceImages.length}/3
              </Caption1>
            </div>
            <div className={styles.refRow}>
              {referenceImages.map((url, i) => (
                <div key={`${url}-${i}`} className={styles.refThumb}>
                  <img src={url} alt={`Ref ${i + 1}`} className={styles.refThumbImg} />
                  <Button
                    className={styles.refRemove}
                    appearance="primary"
                    size="small"
                    icon={<Dismiss12Regular />}
                    onClick={() => removeReference(i)}
                  />
                </div>
              ))}
              {referenceImages.length < 3 && (
                <div
                  className={styles.addRefSlot}
                  onClick={() => addRefInput.current?.click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tokens.colorBrandStroke1
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tokens.colorNeutralStroke2
                  }}
                >
                  <Add16Regular style={{ color: tokens.colorNeutralForeground3 }} />
                </div>
              )}
              <input
                ref={addRefInput}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) addReference(file)
                  e.target.value = ""
                }}
              />
              {referenceImages.length === 0 && (
                <Caption1 style={{ color: tokens.colorNeutralForeground4, marginLeft: tokens.spacingHorizontalS }}>
                  No reference images yet
                </Caption1>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
