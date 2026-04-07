"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { PersonaSettings } from "@/lib/persona-types"

interface FaceShapeSectionProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
}

const faceShapes = [
  { value: "oval", label: "Oval", icon: "○" },
  { value: "square", label: "Square", icon: "□" },
  { value: "heart", label: "Heart", icon: "♡" },
  { value: "diamond", label: "Diamond", icon: "◇" },
  { value: "round", label: "Round", icon: "●" },
  { value: "long", label: "Long", icon: "⬯" },
]

export function FaceShapeSection({ settings, onUpdateSettings }: FaceShapeSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="face-shape" className="border-border">
        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
          Face Shape & Structure
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Face Shape Visual Grid */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Face Shape</Label>
            <div className="grid grid-cols-3 gap-2">
              {faceShapes.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => onUpdateSettings("faceShape", shape.value as PersonaSettings["faceShape"])}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-all",
                    settings.faceShape === shape.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface-elevated text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-lg">{shape.icon}</span>
                  <span className="text-xs">{shape.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Jawline Angularity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Jawline Angularity</Label>
              <span className="text-xs text-muted-foreground">{settings.jawlineAngularity}%</span>
            </div>
            <Slider
              value={[settings.jawlineAngularity]}
              onValueChange={([value]) => onUpdateSettings("jawlineAngularity", value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Soft</span>
              <span>Razor Sharp</span>
            </div>
          </div>

          {/* Jawline Shape */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Jawline Shape</Label>
            <Select
              value={settings.jawlineShape}
              onValueChange={(value) => onUpdateSettings("jawlineShape", value as PersonaSettings["jawlineShape"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="v-shaped">V-shaped</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="tapered">Tapered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cheekbone Height */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Cheekbone Height</Label>
              <span className="text-xs text-muted-foreground">{settings.cheekboneHeight}%</span>
            </div>
            <Slider
              value={[settings.cheekboneHeight]}
              onValueChange={([value]) => onUpdateSettings("cheekboneHeight", value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Cheekbone Prominence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Cheekbone Prominence</Label>
              <span className="text-xs text-muted-foreground">{settings.cheekboneProminence}%</span>
            </div>
            <Slider
              value={[settings.cheekboneProminence]}
              onValueChange={([value]) => onUpdateSettings("cheekboneProminence", value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtle</span>
              <span>Pronounced</span>
            </div>
          </div>

          {/* Chin */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Chin</Label>
            <Select
              value={settings.chin}
              onValueChange={(value) => onUpdateSettings("chin", value as PersonaSettings["chin"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="pointed">Pointed</SelectItem>
                <SelectItem value="cleft">Cleft</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
                <SelectItem value="recessed">Recessed</SelectItem>
                <SelectItem value="prominent">Prominent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
