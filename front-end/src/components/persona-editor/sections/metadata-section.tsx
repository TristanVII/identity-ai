"use client"

import { Section, TextField, SelectField, TagField, FieldGrid } from "../form-primitives"
import type { CharacterMetadata } from "@/types/character-blueprint"

interface Props {
  data: CharacterMetadata
  onChange: (d: CharacterMetadata) => void
}

export function MetadataSection({ data, onChange }: Props) {
  const set = <K extends keyof CharacterMetadata>(k: K, v: CharacterMetadata[K]) =>
    onChange({ ...data, [k]: v })

  return (
    <Section id="metadata" title="Core Identity" defaultOpen>
      <FieldGrid>
        <TextField label="Apparent Age" value={data.apparent_age} onChange={(v) => set("apparent_age", v)} placeholder="e.g., 27, early 30s" />
        <SelectField label="Gender Presentation" value={data.gender_presentation} onChange={(v) => set("gender_presentation", v)} options={["Masculine", "Feminine", "Androgynous", "Non-binary"]} />
      </FieldGrid>
      <TagField label="Ethnic Phenotype" values={data.ethnic_phenotype} onChange={(v) => set("ethnic_phenotype", v)} placeholder="e.g., West African, Northern European" hint="Genetic regions that anchor facial features" />
      <FieldGrid>
        <SelectField label="Body Type" value={data.body_type} onChange={(v) => set("body_type", v)} options={["Ectomorph", "Mesomorph", "Endomorph", "Athletic", "Slim", "Stocky", "Average"]} />
        <TextField label="Base Archetype" value={data.base_archetype} onChange={(v) => set("base_archetype", v)} placeholder="e.g., 70s French actress" />
      </FieldGrid>
      <TextField label="Overall Impression" value={data.overall_impression} onChange={(v) => set("overall_impression", v)} placeholder="1-2 sentence vibe/energy description" multiline hint="Guides the tone of generated prompts" />
    </Section>
  )
}
