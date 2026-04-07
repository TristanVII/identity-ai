"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

interface HairSkinSectionProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
}

const hairColorPresets = [
  { value: "#1A1A1A", label: "Jet Black" },
  { value: "#3D2314", label: "Dark Brown" },
  { value: "#8B4513", label: "Auburn" },
  { value: "#D4A76A", label: "Dirty Blonde" },
  { value: "#F5DEB3", label: "Platinum" },
  { value: "#8B0000", label: "Red" },
  { value: "#C0C0C0", label: "Silver" },
]

const skinToneGradient = [
  { value: 1, color: "#FFE0BD" },
  { value: 2, color: "#F8D5B4" },
  { value: 3, color: "#E8B89D" },
  { value: 4, color: "#C68642" },
  { value: 5, color: "#8D5524" },
  { value: 6, color: "#5C3317" },
]

export function HairSkinSection({ settings, onUpdateSettings }: HairSkinSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hair-skin" className="border-border">
        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
          Hair & Skin Details
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Hair Color */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Hair Color</Label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {hairColorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onUpdateSettings("hairColor", color.value)}
                    title={color.label}
                    className="size-6 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      borderColor: settings.hairColor === color.value ? "var(--primary)" : "transparent",
                    }}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={settings.hairColor}
                onChange={(e) => onUpdateSettings("hairColor", e.target.value)}
                className="size-8 cursor-pointer rounded border-0 p-0"
              />
            </div>
          </div>

          {/* Hair Style / Texture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Hair Style / Texture</Label>
              <span className="text-xs text-muted-foreground/60">
                (Can be changed in prompts later)
              </span>
            </div>
            <Select
              value={settings.hairStyle}
              onValueChange={(value) => onUpdateSettings("hairStyle", value as PersonaSettings["hairStyle"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="wavy">Wavy</SelectItem>
                <SelectItem value="coily">Coily (4C)</SelectItem>
                <SelectItem value="buzzcut">Buzzcut</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skin Tone */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Skin Tone (Fitzpatrick Scale 1-6)
            </Label>
            <div className="flex gap-2">
              {skinToneGradient.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => onUpdateSettings("skinTone", tone.value)}
                  className={cn(
                    "flex-1 rounded-lg border-2 py-4 transition-all hover:scale-105",
                    settings.skinTone === tone.value
                      ? "border-primary shadow-[0_0_8px_rgba(134,239,172,0.3)]"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: tone.color }}
                  title={`Fitzpatrick Type ${tone.value}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Type I</span>
              <span>Type VI</span>
            </div>
          </div>

          {/* Skin Texture & Blemishes */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Skin Texture & Unique Details
            </Label>
            <Textarea
              placeholder='e.g., "Three small freckles on the left cheek", "Tiny scar through the right eyebrow", "Dewy skin texture"'
              value={settings.skinDetails}
              onChange={(e) => onUpdateSettings("skinDetails", e.target.value)}
              className="min-h-20 resize-none border-border bg-input text-sm text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground/60">
              Add specific anomalies to ensure absolute uniqueness
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
