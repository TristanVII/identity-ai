"use client"

import { Section, TextField, SelectField, FieldGrid, SubHeading } from "../form-primitives"
import type { HairAndPilosity } from "@/types/character-blueprint"

interface Props {
  data: HairAndPilosity
  onChange: (d: HairAndPilosity) => void
}

export function HairSection({ data, onChange }: Props) {
  const setHead = <K extends keyof HairAndPilosity["head_hair"]>(k: K, v: HairAndPilosity["head_hair"][K]) =>
    onChange({ ...data, head_hair: { ...data.head_hair, [k]: v } })
  const setStyling = <K extends keyof HairAndPilosity["head_hair"]["styling"]>(k: K, v: string) =>
    onChange({ ...data, head_hair: { ...data.head_hair, styling: { ...data.head_hair.styling, [k]: v } } })
  const setFacial = <K extends keyof HairAndPilosity["facial_hair"]>(k: K, v: string) =>
    onChange({ ...data, facial_hair: { ...data.facial_hair, [k]: v } })
  const setBody = <K extends keyof HairAndPilosity["upper_body_hair"]>(k: K, v: string) =>
    onChange({ ...data, upper_body_hair: { ...data.upper_body_hair, [k]: v } })

  return (
    <Section id="hair" title="Hair & Pilosity">
      <SubHeading>Head Hair</SubHeading>
      <FieldGrid>
        <TextField label="Base Color" value={data.head_hair.base_color} onChange={(v) => setHead("base_color", v)} placeholder="Root color, primary shade" />
        <TextField label="Highlights" value={data.head_hair.highlights_and_undertones} onChange={(v) => setHead("highlights_and_undertones", v)} placeholder="Balayage, brassiness" />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Texture" value={data.head_hair.texture} onChange={(v) => setHead("texture", v)} options={["1a Straight (fine)", "1b Straight (medium)", "1c Straight (coarse)", "2a Wavy (loose)", "2b Wavy (defined)", "2c Wavy (coarse)", "3a Curly (loose)", "3b Curly (tight)", "3c Curly (corkscrew)", "4a Coily (soft)", "4b Coily (wiry)", "4c Coily (tight)"]} />
        <SelectField label="Density" value={data.head_hair.density} onChange={(v) => setHead("density", v)} options={["Very thin", "Thin", "Average", "Thick", "Very thick/Voluminous"]} />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Hairline" value={data.head_hair.hairline} onChange={(v) => setHead("hairline", v)} options={["Straight", "Widow's peak", "Receding", "Rounded", "Uneven", "M-shaped"]} />
        <TextField label="Baby Hairs" value={data.head_hair.baby_hairs} onChange={(v) => setHead("baby_hairs", v)} placeholder="Presence, styling" />
      </FieldGrid>

      <SubHeading>Styling</SubHeading>
      <FieldGrid>
        <TextField label="Parting" value={data.head_hair.styling.parting} onChange={(v) => setStyling("parting", v)} placeholder="e.g., messy left part" />
        <TextField label="Cut & Length" value={data.head_hair.styling.cut_and_length} onChange={(v) => setStyling("cut_and_length", v)} placeholder="Relative to shoulders" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Current State" value={data.head_hair.styling.current_state} onChange={(v) => setStyling("current_state", v)} placeholder="e.g., windblown, tucked" />
        <TextField label="Volume Distribution" value={data.head_hair.styling.volume_distribution} onChange={(v) => setStyling("volume_distribution", v)} placeholder="Where volume sits" />
      </FieldGrid>

      <SubHeading>Facial Hair</SubHeading>
      <FieldGrid>
        <SelectField label="Presence" value={data.facial_hair.presence} onChange={(v) => setFacial("presence", v)} options={["None", "Peach fuzz", "Light stubble", "Heavy stubble", "Short beard", "Full beard", "Mustache only", "Goatee", "Sideburns"]} />
        <TextField label="Pattern" value={data.facial_hair.pattern} onChange={(v) => setFacial("pattern", v)} placeholder="Even, patchy, soul patch" />
      </FieldGrid>

      <SubHeading>Upper Body Hair</SubHeading>
      <FieldGrid>
        <TextField label="Chest & Abdomen" value={data.upper_body_hair.chest_and_abdomen} onChange={(v) => setBody("chest_and_abdomen", v)} placeholder="Sparse, thick, none" />
        <TextField label="Arms & Hands" value={data.upper_body_hair.arms_and_hands} onChange={(v) => setBody("arms_and_hands", v)} placeholder="Coarse, peach fuzz" />
      </FieldGrid>
    </Section>
  )
}
