"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
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
import type { PersonaSettings } from "@/lib/persona-types"

interface EyesBrowsSectionProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
}

const eyeColorPresets = [
  { value: "#4A3728", label: "Dark Brown" },
  { value: "#6B8E23", label: "Hazel" },
  { value: "#4169E1", label: "Blue" },
  { value: "#228B22", label: "Green" },
  { value: "#808080", label: "Gray" },
  { value: "#B8860B", label: "Amber" },
]

export function EyesBrowsSection({ settings, onUpdateSettings }: EyesBrowsSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="eyes-brows" className="border-border">
        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
          Eyes & Brows
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Eye Color */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Eye Color</Label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {eyeColorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onUpdateSettings("eyeColor", color.value)}
                    title={color.label}
                    className="size-6 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      borderColor: settings.eyeColor === color.value ? "var(--primary)" : "transparent",
                    }}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={settings.eyeColor}
                onChange={(e) => onUpdateSettings("eyeColor", e.target.value)}
                className="size-8 cursor-pointer rounded border-0 p-0"
              />
            </div>
          </div>

          {/* Eye Shape */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Eye Shape</Label>
            <Select
              value={settings.eyeShape}
              onValueChange={(value) => onUpdateSettings("eyeShape", value as PersonaSettings["eyeShape"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="almond">Almond</SelectItem>
                <SelectItem value="monolid">Monolid</SelectItem>
                <SelectItem value="round">Round</SelectItem>
                <SelectItem value="hooded">Hooded</SelectItem>
                <SelectItem value="deep-set">Deep-set</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Canthal Tilt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Canthal Tilt</Label>
              <span className="text-xs text-muted-foreground">
                {settings.canthalTilt > 0 ? "+" : ""}{settings.canthalTilt}
              </span>
            </div>
            <Slider
              value={[settings.canthalTilt]}
              onValueChange={([value]) => onUpdateSettings("canthalTilt", value)}
              min={-5}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-5 Negative</span>
              <span>+5 Feline</span>
            </div>
          </div>

          {/* Eyebrow Style */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Eyebrow Style</Label>
            <Select
              value={settings.eyebrowStyle}
              onValueChange={(value) => onUpdateSettings("eyebrowStyle", value as PersonaSettings["eyebrowStyle"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="arched">Arched</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Eyebrow Thickness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Eyebrow Thickness</Label>
              <span className="text-xs text-muted-foreground">{settings.eyebrowThickness}%</span>
            </div>
            <Slider
              value={[settings.eyebrowThickness]}
              onValueChange={([value]) => onUpdateSettings("eyebrowThickness", value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Thin</span>
              <span>Thick</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
