"use client"

import { Upload, Scan, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DemographicsSection } from "./sections/demographics-section"
import { FaceShapeSection } from "./sections/face-shape-section"
import { EyesBrowsSection } from "./sections/eyes-brows-section"
import { NoseMouthSection } from "./sections/nose-mouth-section"
import { HairSkinSection } from "./sections/hair-skin-section"
import type { PersonaSettings } from "@/lib/persona-types"

interface ControlPanelProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
  showAdvanced: boolean
  onToggleAdvanced: (show: boolean) => void
  uploadedReference: string | null
  onUploadReference: (url: string | null) => void
  onAnalyzeImage: () => void
  isAnalyzing: boolean
}

export function ControlPanel({
  settings,
  onUpdateSettings,
  showAdvanced,
  onToggleAdvanced,
  uploadedReference,
  onUploadReference,
  onAnalyzeImage,
  isAnalyzing,
}: ControlPanelProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUploadReference(url)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      onUploadReference(url)
    }
  }

  return (
    <aside className="flex w-full flex-col border-r border-border bg-surface-elevated md:w-[420px] lg:w-[480px]">
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {/* Section 1: AI Reverse-Engineering */}
          <Card className="border-primary/30 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Scan className="size-5 text-primary" />
                AI Reverse-Engineering
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload a reference image to auto-populate settings
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!uploadedReference ? (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-sunken p-8 transition-colors hover:border-primary/50 hover:bg-input"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="mb-2 size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop a face reference, or click to browse
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
                    <img
                      src={uploadedReference}
                      alt="Reference"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <Button
                      onClick={onAnalyzeImage}
                      disabled={isAnalyzing}
                      className="w-full gap-2 bg-primary text-primary-foreground"
                    >
                      {isAnalyzing ? (
                        <>
                          <Spinner className="size-4" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="size-4" />
                          Extract Facial Metadata
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUploadReference(null)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove Reference
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Core Demographics */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Core Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DemographicsSection
                settings={settings}
                onUpdateSettings={onUpdateSettings}
              />
            </CardContent>
          </Card>

          {/* Section 3: Advanced Facial Rigging Toggle */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-foreground">
                  Deep Granularity Engine
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="advanced-toggle" className="text-sm text-muted-foreground">
                    Advanced Rigging
                  </Label>
                  <Switch
                    id="advanced-toggle"
                    checked={showAdvanced}
                    onCheckedChange={onToggleAdvanced}
                  />
                </div>
              </div>
            </CardHeader>
            
            {showAdvanced && (
              <CardContent className="space-y-4 border-t border-border pt-4">
                <FaceShapeSection
                  settings={settings}
                  onUpdateSettings={onUpdateSettings}
                />
                <EyesBrowsSection
                  settings={settings}
                  onUpdateSettings={onUpdateSettings}
                />
                <NoseMouthSection
                  settings={settings}
                  onUpdateSettings={onUpdateSettings}
                />
                <HairSkinSection
                  settings={settings}
                  onUpdateSettings={onUpdateSettings}
                />
              </CardContent>
            )}
            
            {!showAdvanced && (
              <CardContent className="pt-0">
                <button
                  onClick={() => onToggleAdvanced(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-sunken py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <ChevronDown className="size-4" />
                  Show Advanced Facial Rigging
                </button>
              </CardContent>
            )}
          </Card>
        </div>
      </ScrollArea>
    </aside>
  )
}
