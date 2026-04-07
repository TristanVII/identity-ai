"use client"

import { Section, TextField, SelectField, TagField, FieldGrid, SubHeading } from "../form-primitives"
import type { ExpressionAndBodyLanguage, CosmeticsAndGrooming, UpperBodyStyling, BodyModifications, CharacterConsistencyAnchors } from "@/types/character-blueprint"

// ── Expression ───────────────────────────────────────────────────────────────

interface ExpressionProps {
  data: ExpressionAndBodyLanguage
  onChange: (d: ExpressionAndBodyLanguage) => void
}

export function ExpressionSection({ data, onChange }: ExpressionProps) {
  const setMicro = <K extends keyof ExpressionAndBodyLanguage["facial_micro_movements"]>(k: K, v: string) =>
    onChange({ ...data, facial_micro_movements: { ...data.facial_micro_movements, [k]: v } })
  const setPosture = <K extends keyof ExpressionAndBodyLanguage["posture_and_carriage"]>(k: K, v: string) =>
    onChange({ ...data, posture_and_carriage: { ...data.posture_and_carriage, [k]: v } })

  return (
    <Section id="expression" title="Expression & Body Language">
      <TextField label="Default Resting Expression" value={data.default_resting_expression} onChange={(v) => onChange({ ...data, default_resting_expression: v })} placeholder="e.g., soft and alert, resting scowl" />
      <TextField label="Smile" value={data.smile_description} onChange={(v) => onChange({ ...data, smile_description: v })} placeholder="Gummy, closed-lip, asymmetrical, dimples" />
      <SubHeading>Micro Movements</SubHeading>
      <FieldGrid>
        <TextField label="Forehead" value={data.facial_micro_movements.forehead_tension} onChange={(v) => setMicro("forehead_tension", v)} placeholder="Furrowed, relaxed" />
        <TextField label="Eyes" value={data.facial_micro_movements.eye_engagement} onChange={(v) => setMicro("eye_engagement", v)} placeholder="Squinting, wide-eyed" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Mouth" value={data.facial_micro_movements.mouth_tension} onChange={(v) => setMicro("mouth_tension", v)} placeholder="Pursed, smirk" />
        <TextField label="Jaw & Neck" value={data.facial_micro_movements.neck_and_jaw_tension} onChange={(v) => setMicro("neck_and_jaw_tension", v)} placeholder="Clenching, relaxed" />
      </FieldGrid>
      <SubHeading>Posture</SubHeading>
      <FieldGrid>
        <SelectField label="Spine" value={data.posture_and_carriage.spine} onChange={(v) => setPosture("spine", v)} options={["Slouched", "Neutral", "Military straight", "Arched back"]} />
        <SelectField label="Shoulders" value={data.posture_and_carriage.shoulder_carriage} onChange={(v) => setPosture("shoulder_carriage", v)} options={["Hunched", "Relaxed", "Asymmetrical drop", "Pulled back"]} />
      </FieldGrid>
    </Section>
  )
}

// ── Cosmetics ────────────────────────────────────────────────────────────────

interface CosmeticsProps {
  data: CosmeticsAndGrooming
  onChange: (d: CosmeticsAndGrooming) => void
}

export function CosmeticsSection({ data, onChange }: CosmeticsProps) {
  const setMakeup = <K extends keyof CosmeticsAndGrooming["makeup"]>(k: K, v: string) =>
    onChange({ ...data, makeup: { ...data.makeup, [k]: v } })

  return (
    <Section id="cosmetics" title="Cosmetics & Grooming">
      <SelectField label="Skincare Finish" value={data.skincare_finish} onChange={(v) => onChange({ ...data, skincare_finish: v })} options={["Bare/Natural", "Matte", "Dewy", "Sweaty", "Oily", "Flaky"]} />
      <SubHeading>Makeup</SubHeading>
      <FieldGrid>
        <SelectField label="Base" value={data.makeup.base} onChange={(v) => setMakeup("base", v)} options={["Bare face", "Sheer tint", "Light foundation", "Full coverage", "Baking"]} />
        <TextField label="Eyes" value={data.makeup.eyes} onChange={(v) => setMakeup("eyes", v)} placeholder="Shadow, liner, mascara" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Lips" value={data.makeup.lips} onChange={(v) => setMakeup("lips", v)} placeholder="Shade, gloss level" />
        <TextField label="Blush" value={data.makeup.blush} onChange={(v) => setMakeup("blush", v)} placeholder="Color, placement" />
      </FieldGrid>
      <TextField label="Contour & Highlight" value={data.makeup.contour_and_highlight} onChange={(v) => setMakeup("contour_and_highlight", v)} placeholder="Placement, intensity" />
    </Section>
  )
}

// ── Styling ──────────────────────────────────────────────────────────────────

interface StylingProps {
  data: UpperBodyStyling
  onChange: (d: UpperBodyStyling) => void
}

export function StylingSection({ data, onChange }: StylingProps) {
  const setClothing = <K extends keyof UpperBodyStyling["clothing"]>(k: K, v: string) =>
    onChange({ ...data, clothing: { ...data.clothing, [k]: v } })

  return (
    <Section id="styling" title="Upper Body Styling">
      <FieldGrid>
        <SelectField label="Neckline" value={data.clothing.neckline} onChange={(v) => setClothing("neckline", v)} options={["Crew neck", "V-neck", "Deep V", "Scoop", "Turtleneck", "Cowl", "Off-shoulder", "Bare/Shirtless"]} />
        <SelectField label="Fit" value={data.clothing.fit} onChange={(v) => setClothing("fit", v)} options={["Skin-tight", "Tailored", "Regular", "Relaxed", "Oversized", "Draped"]} />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Sleeve Length" value={data.clothing.sleeve_length} onChange={(v) => setClothing("sleeve_length", v)} options={["Sleeveless", "Cap sleeves", "Short", "3/4 length", "Long", "Rolled forearms"]} />
        <TextField label="Fabric" value={data.clothing.fabric_details} onChange={(v) => setClothing("fabric_details", v)} placeholder="Material, color, texture" />
      </FieldGrid>
      <SubHeading>Accessories</SubHeading>
      <TagField label="Neck" values={data.accessories.neck} onChange={(v) => onChange({ ...data, accessories: { ...data.accessories, neck: v } })} placeholder="e.g., gold chain, choker" />
      <TagField label="Wrists & Hands" values={data.accessories.wrists_and_hands} onChange={(v) => onChange({ ...data, accessories: { ...data.accessories, wrists_and_hands: v } })} placeholder="e.g., silver watch, ring on left index" />
      <TextField label="Eyewear" value={data.accessories.eyewear} onChange={(v) => onChange({ ...data, accessories: { ...data.accessories, eyewear: v } })} placeholder="Glasses shape, frame, tint" />
    </Section>
  )
}

// ── Modifications ────────────────────────────────────────────────────────────

interface ModificationsProps {
  data: BodyModifications
  onChange: (d: BodyModifications) => void
}

export function ModificationsSection({ data, onChange }: ModificationsProps) {
  return (
    <Section id="modifications" title="Body Modifications">
      <TagField label="Scars & Branding" values={data.scars_and_branding} onChange={(v) => onChange({ ...data, scars_and_branding: v })} placeholder="e.g., appendectomy scar on right abdomen" />
      <TextField label="Cosmetic Procedures" value={data.cosmetic_procedures} onChange={(v) => onChange({ ...data, cosmetic_procedures: v })} placeholder="Filler, botox, rhinoplasty" hint="Affects rendered facial shape" />
    </Section>
  )
}

// ── Consistency Anchors ──────────────────────────────────────────────────────

interface AnchorsProps {
  data: CharacterConsistencyAnchors
  onChange: (d: CharacterConsistencyAnchors) => void
}

export function AnchorsSection({ data, onChange }: AnchorsProps) {
  return (
    <Section id="anchors" title="Consistency Anchors" defaultOpen>
      <TagField label="Must-Keep Traits" values={data.must_keep_traits} onChange={(v) => onChange({ ...data, must_keep_traits: v })} placeholder="e.g., mole under left eye" hint="Non-negotiable defining features preserved across every generation" />
      <TagField label="Avoid Elements" values={data.avoid_elements} onChange={(v) => onChange({ ...data, avoid_elements: v })} placeholder="e.g., symmetrical face" hint="Elements that would break consistency" />
      <TagField label="Signature Colors" values={data.signature_colors} onChange={(v) => onChange({ ...data, signature_colors: v })} placeholder="e.g., warm amber, muted teal" />
      <TextField label="Lighting Notes" value={data.lighting_notes} onChange={(v) => onChange({ ...data, lighting_notes: v })} placeholder="Preferred direction, mood for consistency" />
    </Section>
  )
}
