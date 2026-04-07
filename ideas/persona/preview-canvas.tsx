"use client"

import { Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PersonaSettings, PreviewHistory } from "@/lib/persona-types"

interface PreviewCanvasProps {
  currentPreview: string | null
  previewHistory: PreviewHistory[]
  isGenerating: boolean
  onGenerate: () => void
  onSelectHistoryItem: (item: PreviewHistory) => void
  settings: PersonaSettings
}

export function PreviewCanvas({
  currentPreview,
  previewHistory,
  isGenerating,
  onGenerate,
  onSelectHistoryItem,
  settings,
}: PreviewCanvasProps) {
  const currentHistoryItem = previewHistory.find(item => item.id === currentPreview)

  return (
    <main className="sticky top-0 flex flex-1 flex-col bg-background p-4 lg:p-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Main Viewport */}
        <div className="relative mb-6 flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-sunken">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative size-full">
                <Skeleton className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/20 via-accent to-primary/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                    <Sparkles className="relative size-12 animate-pulse text-primary" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Rendering facial geometry...
                  </p>
                </div>
              </div>
            </div>
          ) : currentHistoryItem ? (
            <GeneratedPreview settings={currentHistoryItem.settings} />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="rounded-full border border-border bg-input p-6">
                <User className="size-16 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No Preview Generated</p>
                <p className="text-sm text-muted-foreground">
                  Adjust settings and click Generate to see your persona
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className="mb-6 gap-2 bg-primary px-8 text-primary-foreground shadow-[0_0_20px_rgba(134,239,172,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(134,239,172,0.4)]"
        >
          <Sparkles className="size-5" />
          {isGenerating ? "Generating..." : "Generate Current Look"}
        </Button>

        {/* History Strip */}
        {previewHistory.length > 0 && (
          <div className="w-full max-w-md">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recent Previews
            </p>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {previewHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item)}
                    className={cn(
                      "relative shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      currentPreview === item.id
                        ? "border-primary shadow-[0_0_12px_rgba(134,239,172,0.3)]"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div className="size-16 bg-surface-elevated">
                      <PreviewThumbnail settings={item.settings} />
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </div>
    </main>
  )
}

// Placeholder component for generated preview
function GeneratedPreview({ settings }: { settings: PersonaSettings }) {
  // This creates a visual representation based on settings
  const faceShapeStyles: Record<string, string> = {
    oval: "rounded-[45%]",
    square: "rounded-[20%]",
    heart: "rounded-[40%_40%_35%_35%]",
    diamond: "rounded-[45%]",
    round: "rounded-full",
    long: "rounded-[40%]",
  }

  return (
    <div className="relative flex size-full flex-col items-center justify-center bg-gradient-to-b from-surface-elevated to-surface-sunken p-8">
      {/* Generated face visualization */}
      <div
        className={cn(
          "relative flex aspect-[0.85] w-3/4 flex-col items-center justify-center border border-border bg-gradient-to-b from-amber-100/80 to-amber-200/60",
          faceShapeStyles[settings.faceShape]
        )}
        style={{
          filter: `brightness(${1 - (settings.skinTone - 1) * 0.1})`,
        }}
      >
        {/* Eyes */}
        <div className="mb-4 flex gap-6">
          <div
            className="size-6 rounded-full border-2 border-neutral-800"
            style={{ backgroundColor: settings.eyeColor }}
          />
          <div
            className="size-6 rounded-full border-2 border-neutral-800"
            style={{ backgroundColor: settings.eyeColor }}
          />
        </div>
        
        {/* Nose */}
        <div className="mb-3 h-6 w-3 rounded-b-full bg-amber-300/50" />
        
        {/* Lips */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-2 w-8 rounded-t-full bg-rose-400" />
          <div className="h-2.5 w-10 rounded-b-full bg-rose-500" />
        </div>
        
        {/* Dimples */}
        {settings.leftDimple && (
          <div className="absolute left-1/4 top-2/3 size-2 rounded-full bg-amber-400/50" />
        )}
        {settings.rightDimple && (
          <div className="absolute right-1/4 top-2/3 size-2 rounded-full bg-amber-400/50" />
        )}
      </div>
      
      {/* Hair */}
      <div
        className="absolute top-4 h-24 w-3/4 rounded-t-full"
        style={{ backgroundColor: settings.hairColor }}
      />
      
      {/* Settings summary */}
      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/80 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-primary/20 px-2 py-1 text-primary">
            {settings.gender}
          </span>
          <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
            Age {settings.age}
          </span>
          <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
            {settings.faceShape} face
          </span>
          <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
            {settings.hairStyle} hair
          </span>
        </div>
      </div>
    </div>
  )
}

function PreviewThumbnail({ settings }: { settings: PersonaSettings }) {
  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-b from-surface-elevated to-surface-sunken">
      <div
        className="size-8 rounded-full"
        style={{ backgroundColor: settings.hairColor }}
      />
    </div>
  )
}
