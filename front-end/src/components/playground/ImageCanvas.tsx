"use client"

import { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from "react"
import {
  Button,
  Body1,
  Caption1,
  Spinner,
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  Circle24Regular,
  Cursor24Regular,
  ArrowDownload24Regular,
  Dismiss16Regular,
  PersonSwap24Regular,
} from "@fluentui/react-icons"

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    position: "relative",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  toolGroup: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    padding: "2px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  toolBtn: {
    minWidth: "30px",
    width: "30px",
    height: "30px",
    padding: "0",
    borderRadius: tokens.borderRadiusSmall,
  },
  canvasWrap: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    // Subtle checkerboard pattern for transparency
    backgroundImage:
      "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), " +
      "linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), " +
      "linear-gradient(45deg, transparent 75%, #e8e8e8 75%), " +
      "linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    backgroundColor: "#f0f0f0",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    userSelect: "none",
    pointerEvents: "none",
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
  },
  svgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "crosshair",
  },
  selectionBadge: {
    position: "absolute",
    bottom: tokens.spacingVerticalL,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: `6px ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusCircular,
    boxShadow: tokens.shadow8,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalXXL,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingVerticalM,
    backgroundColor: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(8px)",
    zIndex: 10,
  },
})

export interface Region {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageCanvasHandle {
  /** Composites the circle overlay onto the image and returns a base64 data URL */
  getAnnotatedImage: () => string | null
}

interface ImageCanvasProps {
  imageUrl: string | null
  isGenerating: boolean
  onRegionSelected: (region: Region | null) => void
  selectedRegion: Region | null
  onFaceSwap?: (base64DataUrl: string) => void
}

export const ImageCanvas = forwardRef<ImageCanvasHandle, ImageCanvasProps>(
  function ImageCanvas(
    { imageUrl, isGenerating, onRegionSelected, selectedRegion, onFaceSwap },
    ref
  ) {
  const styles = useStyles()
  const [tool, setTool] = useState<"select" | "circle">("select")
  const svgRef = useRef<SVGSVGElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const ellipseRef = useRef<SVGEllipseElement>(null)
  const maskEllipseRef = useRef<SVGEllipseElement>(null)
  const dimRef = useRef<SVGRectElement>(null)
  const faceSwapInputRef = useRef<HTMLInputElement>(null)

  // Use refs for transient drag state to avoid re-render storms
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const isDrawing = useRef(false)

  // Expose getAnnotatedImage to parent via ref
  useImperativeHandle(ref, () => ({
    getAnnotatedImage: () => {
      const img = imgRef.current
      if (!img || !selectedRegion) return null

      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Draw semi-transparent overlay with ellipse cutout (even-odd fill)
      const { x, y, width, height } = selectedRegion
      const cx = (x + width / 2) * canvas.width
      const cy = (y + height / 2) * canvas.height
      const rx = (width / 2) * canvas.width
      const ry = (height / 2) * canvas.height

      ctx.save()
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      ctx.beginPath()
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, true)
      ctx.fill("evenodd")
      ctx.restore()

      // Draw dashed ellipse border
      const scale = canvas.width / 800
      ctx.save()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = Math.max(2, 3 * scale)
      ctx.setLineDash([10 * scale, 5 * scale])
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      return canvas.toDataURL("image/png")
    },
  }), [selectedRegion])

  const getImageCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!imgRef.current) return null
      const rect = imgRef.current.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      return {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      }
    },
    []
  )

  const updateEllipse = useCallback(
    (region: { x: number; y: number; width: number; height: number } | null) => {
      if (!imgRef.current || !svgRef.current) return
      if (!region || (region.width < 0.01 && region.height < 0.01)) {
        if (ellipseRef.current) ellipseRef.current.setAttribute("rx", "0")
        if (maskEllipseRef.current) maskEllipseRef.current.setAttribute("rx", "0")
        if (dimRef.current) dimRef.current.setAttribute("fill-opacity", "0")
        return
      }
      const imgRect = imgRef.current.getBoundingClientRect()
      const svgRect = svgRef.current.getBoundingClientRect()
      const ox = imgRect.left - svgRect.left + region.x * imgRect.width
      const oy = imgRect.top - svgRect.top + region.y * imgRect.height
      const ow = region.width * imgRect.width
      const oh = region.height * imgRect.height
      const cx = String(ox + ow / 2)
      const cy = String(oy + oh / 2)
      const rx = String(ow / 2)
      const ry = String(oh / 2)

      if (ellipseRef.current) {
        ellipseRef.current.setAttribute("cx", cx)
        ellipseRef.current.setAttribute("cy", cy)
        ellipseRef.current.setAttribute("rx", rx)
        ellipseRef.current.setAttribute("ry", ry)
      }
      if (maskEllipseRef.current) {
        maskEllipseRef.current.setAttribute("cx", cx)
        maskEllipseRef.current.setAttribute("cy", cy)
        maskEllipseRef.current.setAttribute("rx", rx)
        maskEllipseRef.current.setAttribute("ry", ry)
      }
      if (dimRef.current) {
        dimRef.current.setAttribute("fill-opacity", "0.35")
      }
    },
    []
  )

  // Show selected region overlay (from props) on mount/change
  useEffect(() => {
    if (selectedRegion && !isDrawing.current) {
      updateEllipse(selectedRegion)
    } else if (!selectedRegion && !isDrawing.current) {
      updateEllipse(null)
    }
  }, [selectedRegion, updateEllipse])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (tool !== "circle" || !imageUrl) return
      const coords = getImageCoords(e.clientX, e.clientY)
      if (coords) {
        drawStartRef.current = coords
        isDrawing.current = true
        onRegionSelected(null)
        updateEllipse(null)
      }
    },
    [tool, imageUrl, getImageCoords, onRegionSelected, updateEllipse]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing.current || !drawStartRef.current) return
      const coords = getImageCoords(e.clientX, e.clientY)
      if (!coords) return
      const start = drawStartRef.current
      const region = {
        x: Math.min(start.x, coords.x),
        y: Math.min(start.y, coords.y),
        width: Math.abs(coords.x - start.x),
        height: Math.abs(coords.y - start.y),
      }
      updateEllipse(region)
    },
    [getImageCoords, updateEllipse]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing.current || !drawStartRef.current) return
      const coords = getImageCoords(e.clientX, e.clientY)
      if (coords) {
        const start = drawStartRef.current
        const x = Math.min(start.x, coords.x)
        const y = Math.min(start.y, coords.y)
        const width = Math.abs(coords.x - start.x)
        const height = Math.abs(coords.y - start.y)
        if (width > 0.02 && height > 0.02) {
          onRegionSelected({ x, y, width, height })
        } else {
          updateEllipse(null)
        }
      }
      drawStartRef.current = null
      isDrawing.current = false
    },
    [getImageCoords, onRegionSelected, updateEllipse]
  )

  const handleMouseLeave = useCallback(() => {
    if (isDrawing.current && drawStartRef.current) {
      drawStartRef.current = null
      isDrawing.current = false
      if (!selectedRegion) updateEllipse(null)
    }
  }, [selectedRegion, updateEllipse])

  // Clear region when switching tools
  useEffect(() => {
    if (tool === "select") {
      onRegionSelected(null)
      updateEllipse(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool])

  return (
    <div className={styles.root}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <Tooltip content="Move" relationship="label">
            <Button
              className={styles.toolBtn}
              appearance={tool === "select" ? "primary" : "subtle"}
              icon={<Cursor24Regular />}
              onClick={() => setTool("select")}
              size="small"
            />
          </Tooltip>
          <Tooltip content="Select region to edit" relationship="label">
            <Button
              className={styles.toolBtn}
              appearance={tool === "circle" ? "primary" : "subtle"}
              icon={<Circle24Regular />}
              onClick={() => setTool("circle")}
              size="small"
              disabled={!imageUrl}
            />
          </Tooltip>
        </div>
        <Tooltip content="Face swap — upload a photo to swap the face with your persona" relationship="label">
          <Button
            className={styles.toolBtn}
            appearance="subtle"
            icon={<PersonSwap24Regular />}
            size="small"
            disabled={isGenerating}
            onClick={() => faceSwapInputRef.current?.click()}
          />
        </Tooltip>
        <input
          ref={faceSwapInputRef}
          type="file"
          accept="image/jpeg,image/png"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file || !onFaceSwap) return
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onFaceSwap(reader.result)
              }
            }
            reader.readAsDataURL(file)
            e.target.value = ""
          }}
        />
        <div style={{ flex: 1 }} />
        {imageUrl && (
          <Tooltip content="Download image" relationship="label">
            <Button
              className={styles.toolBtn}
              appearance="subtle"
              icon={<ArrowDownload24Regular />}
              size="small"
              onClick={() => {
                const a = document.createElement("a")
                a.href = imageUrl
                a.download = "generated.png"
                a.click()
              }}
            />
          </Tooltip>
        )}
      </div>

      {/* Canvas */}
      <div className={styles.canvasWrap}>
        {isGenerating && (
          <div className={styles.loadingOverlay}>
            <Spinner size="large" appearance="inverted" />
            <Body1 style={{ color: "#fff", fontWeight: tokens.fontWeightSemibold }}>
              Generating...
            </Body1>
          </div>
        )}

        {imageUrl ? (
          <>
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Generated"
              className={styles.image}
              draggable={false}
            />
            {tool === "circle" && (
              <svg
                ref={svgRef}
                className={styles.svgOverlay}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <mask id="region-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <ellipse ref={maskEllipseRef} cx="0" cy="0" rx="0" ry="0" fill="black" />
                  </mask>
                </defs>
                <rect
                  ref={dimRef}
                  width="100%"
                  height="100%"
                  fill="black"
                  fillOpacity="0"
                  mask="url(#region-mask)"
                />
                <ellipse
                  ref={ellipseRef}
                  cx="0"
                  cy="0"
                  rx="0"
                  ry="0"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />
              </svg>
            )}
          </>
        ) : (
          !isGenerating && (
            <div className={styles.emptyState}>
              <Body1 style={{ color: tokens.colorNeutralForeground3, fontWeight: tokens.fontWeightSemibold }}>
                Your canvas is empty
              </Body1>
              <Caption1 style={{ color: tokens.colorNeutralForeground4, maxWidth: 280 }}>
                Describe a scene below and your character will be placed in it.
              </Caption1>
            </div>
          )
        )}

        {selectedRegion && (
          <div className={styles.selectionBadge}>
            <Caption1 style={{ fontWeight: tokens.fontWeightSemibold }}>Region selected</Caption1>
            <Button
              appearance="subtle"
              size="small"
              icon={<Dismiss16Regular />}
              onClick={() => onRegionSelected(null)}
              style={{ minWidth: 20, width: 20, height: 20, padding: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  )
  }
)
