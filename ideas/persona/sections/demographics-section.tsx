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
import type { PersonaSettings } from "@/lib/persona-types"

interface DemographicsSectionProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
}

export function DemographicsSection({ settings, onUpdateSettings }: DemographicsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Gender Presentation */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Gender Presentation</Label>
        <Select
          value={settings.gender}
          onValueChange={(value) => onUpdateSettings("gender", value as PersonaSettings["gender"])}
        >
          <SelectTrigger className="w-full border-border bg-input text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="androgynous">Androgynous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visual Age */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Visual Age</Label>
          <Input
            type="number"
            min={18}
            max={80}
            value={settings.age}
            onChange={(e) => onUpdateSettings("age", Number(e.target.value))}
            className="h-7 w-16 border-border bg-input text-center text-sm text-foreground"
          />
        </div>
        <Slider
          value={[settings.age]}
          onValueChange={([value]) => onUpdateSettings("age", value)}
          min={18}
          max={80}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>18</span>
          <span>80</span>
        </div>
      </div>

      {/* Ethnicity / Heritage */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Ethnicity / Heritage</Label>
        <Input
          type="text"
          placeholder="e.g., Caucasian, Mixed East-Asian, Afro-Latina"
          value={settings.ethnicity}
          onChange={(e) => onUpdateSettings("ethnicity", e.target.value)}
          className="w-full border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Body Type (for neck/shoulder context)</Label>
        <Select
          value={settings.bodyType}
          onValueChange={(value) => onUpdateSettings("bodyType", value as PersonaSettings["bodyType"])}
        >
          <SelectTrigger className="w-full border-border bg-input text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            <SelectItem value="slim">Slim</SelectItem>
            <SelectItem value="athletic">Athletic</SelectItem>
            <SelectItem value="curvy">Curvy</SelectItem>
            <SelectItem value="muscular">Muscular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
