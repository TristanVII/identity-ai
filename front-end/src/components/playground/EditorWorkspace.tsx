"use client"

import { useState, useCallback, useRef, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import {
  Body1,
  Button,
  Caption1,
  Input,
  Spinner,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  Send24Regular,
  Image24Regular,
} from "@fluentui/react-icons"
import { ImageCanvas, type Region, type ImageCanvasHandle } from "./ImageCanvas"
import { SettingsPanel, type EditHistoryItem } from "./SettingsPanel"

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: "flex",
    height: "100%",
    overflow: "hidden",
  },
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  promptBar: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  promptInput: {
    flex: 1,
  },
  sendBtn: {
    borderRadius: tokens.borderRadiusCircular,
    minWidth: "36px",
    width: "36px",
    height: "36px",
    padding: "0",
  },
  emptyRoot: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingVerticalL,
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: tokens.shadow4,
  },
  regionChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    padding: `2px ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
    flexShrink: 0,
  },
  errorBar: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorPaletteRedBackground1,
  },
})

export function EditorWorkspace() {
  const styles = useStyles()
  const searchParams = useSearchParams()
  const personaId = searchParams.get("persona")

  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [history, setHistory] = useState<EditHistoryItem[]>([])
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [imageSize, setImageSize] = useState("1K")
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<ImageCanvasHandle>(null)

  const handleFaceSwap = useCallback(
    async (base64DataUrl: string) => {
      if (!personaId || isGenerating) return

      setIsGenerating(true)
      setError(null)
      setSelectedRegion(null)

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona_id: personaId,
            prompt: "__faceswap__",
            faceswap_image: base64DataUrl,
            aspect_ratio: aspectRatio,
            image_size: imageSize,
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error || "Face swap failed")
        }

        const data = await res.json()

        setHistory((prev) => [
          {
            id: data.generation_id,
            prompt: "Face swap",
            imageUrl: data.result_url,
            timestamp: Date.now(),
          },
          ...prev,
        ])
        setCurrentImage(data.result_url)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Face swap failed")
      } finally {
        setIsGenerating(false)
      }
    },
    [personaId, isGenerating, aspectRatio, imageSize]
  )

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault()
      if (!prompt.trim() || !personaId || isGenerating) return

      const userPrompt = prompt.trim()
      setPrompt("")
      setIsGenerating(true)
      setError(null)

      try {
        // If a region is selected, composite the overlay onto the image
        let annotatedImage: string | null = null
        if (selectedRegion && currentImage) {
          annotatedImage = canvasRef.current?.getAnnotatedImage() ?? null
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona_id: personaId,
            prompt: userPrompt,
            previous_image_url: currentImage,
            annotated_image: annotatedImage,
            aspect_ratio: aspectRatio,
            image_size: imageSize,
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error || "Generation failed")
        }

        const data = await res.json()

        setHistory((prev) => [
          {
            id: data.generation_id,
            prompt: userPrompt,
            imageUrl: data.result_url,
            timestamp: Date.now(),
          },
          ...prev,
        ])
        setCurrentImage(data.result_url)
        setSelectedRegion(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed")
      } finally {
        setIsGenerating(false)
      }
    },
    [prompt, personaId, isGenerating, currentImage, selectedRegion, aspectRatio, imageSize]
  )

  const handleHistorySelect = useCallback((item: EditHistoryItem) => {
    setCurrentImage(item.imageUrl)
    setSelectedRegion(null)
  }, [])

  const handleHistoryClear = useCallback(() => {
    setHistory([])
    setCurrentImage(null)
    setSelectedRegion(null)
  }, [])

  if (!personaId) {
    return (
      <div className={styles.emptyRoot}>
        <div className={styles.emptyIcon}>
          <Image24Regular style={{ fontSize: 28, color: tokens.colorNeutralForeground3 }} />
        </div>
        <Title3 style={{ color: tokens.colorNeutralForeground2, letterSpacing: "-0.02em" }}>
          Select a persona
        </Title3>
        <Body1 style={{ color: tokens.colorNeutralForeground4, maxWidth: 320, textAlign: "center" }}>
          Choose a finalized persona from the sidebar to start generating images.
        </Body1>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.center}>
        <ImageCanvas
          ref={canvasRef}
          imageUrl={currentImage}
          isGenerating={isGenerating}
          onRegionSelected={setSelectedRegion}
          selectedRegion={selectedRegion}
          onFaceSwap={handleFaceSwap}
        />

        {error && (
          <div className={styles.errorBar}>
            <Caption1 style={{ color: tokens.colorPaletteRedForeground1 }}>{error}</Caption1>
          </div>
        )}

        {/* Prompt bar */}
        <form className={styles.promptBar} onSubmit={handleSubmit}>
          {selectedRegion && (
            <span className={styles.regionChip}>Region</span>
          )}
          <Input
            className={styles.promptInput}
            value={prompt}
            onChange={(_, d) => setPrompt(d.value)}
            placeholder={
              currentImage
                ? selectedRegion
                  ? "Describe what to change in the selected area..."
                  : "Describe edits to refine the image..."
                : "Describe a scene for your character..."
            }
            disabled={isGenerating}
            size="large"
            appearance="filled-darker"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <Button
            className={styles.sendBtn}
            appearance="primary"
            icon={isGenerating ? <Spinner size="tiny" /> : <Send24Regular />}
            disabled={isGenerating || !prompt.trim()}
            onClick={() => handleSubmit()}
          />
        </form>
      </div>

      <SettingsPanel
        aspectRatio={aspectRatio}
        imageSize={imageSize}
        onAspectRatioChange={setAspectRatio}
        onImageSizeChange={setImageSize}
        history={history}
        onHistorySelect={handleHistorySelect}
        onHistoryClear={handleHistoryClear}
      />
    </div>
  )
}
