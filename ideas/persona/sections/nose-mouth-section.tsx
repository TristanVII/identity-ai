"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
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

interface NoseMouthSectionProps {
  settings: PersonaSettings
  onUpdateSettings: (key: keyof PersonaSettings, value: PersonaSettings[keyof PersonaSettings]) => void
}

export function NoseMouthSection({ settings, onUpdateSettings }: NoseMouthSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="nose-mouth" className="border-border">
        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
          Nose & Mouth
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Nose Bridge */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nose Bridge</Label>
            <Select
              value={settings.noseBridge}
              onValueChange={(value) => onUpdateSettings("noseBridge", value as PersonaSettings["noseBridge"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="roman">Roman / Aquiline</SelectItem>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="concave">Concave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nose Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Nose Width</Label>
              <span className="text-xs text-muted-foreground">{settings.noseWidth}%</span>
            </div>
            <Slider
              value={[settings.noseWidth]}
              onValueChange={([value]) => onUpdateSettings("noseWidth", value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Narrow</span>
              <span>Wide</span>
            </div>
          </div>

          {/* Lip Volume */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Lip Volume</Label>
            <Select
              value={settings.lipVolume}
              onValueChange={(value) => onUpdateSettings("lipVolume", value as PersonaSettings["lipVolume"])}
            >
              <SelectTrigger className="w-full border-border bg-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="thin">Thin</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="bottom-heavy">Bottom-heavy</SelectItem>
                <SelectItem value="top-heavy">Top-heavy</SelectItem>
                <SelectItem value="cupid">{"Cupid's Bow Prominent"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Smile Lines / Dimples */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Smile Lines / Dimples</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="left-dimple"
                  checked={settings.leftDimple}
                  onCheckedChange={(checked) => onUpdateSettings("leftDimple", checked === true)}
                />
                <Label htmlFor="left-dimple" className="cursor-pointer text-sm text-foreground">
                  Left Dimple
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="right-dimple"
                  checked={settings.rightDimple}
                  onCheckedChange={(checked) => onUpdateSettings("rightDimple", checked === true)}
                />
                <Label htmlFor="right-dimple" className="cursor-pointer text-sm text-foreground">
                  Right Dimple
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="nasolabial"
                  checked={settings.nasolabialFolds}
                  onCheckedChange={(checked) => onUpdateSettings("nasolabialFolds", checked === true)}
                />
                <Label htmlFor="nasolabial" className="cursor-pointer text-sm text-foreground">
                  Subtle Nasolabial Folds
                </Label>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
