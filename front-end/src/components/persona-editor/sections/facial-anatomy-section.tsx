"use client"

import { Section, TextField, SelectField, FieldGrid, SubHeading } from "../form-primitives"
import type { FacialAnatomy } from "@/types/character-blueprint"

interface Props {
  data: FacialAnatomy
  onChange: (d: FacialAnatomy) => void
}

export function FacialAnatomySection({ data, onChange }: Props) {
  const setBone = <K extends keyof FacialAnatomy["bone_structure_and_proportions"]>(k: K, v: string) =>
    onChange({ ...data, bone_structure_and_proportions: { ...data.bone_structure_and_proportions, [k]: v } })
  const setSoft = <K extends keyof FacialAnatomy["soft_tissue_and_flesh"]>(k: K, v: string) =>
    onChange({ ...data, soft_tissue_and_flesh: { ...data.soft_tissue_and_flesh, [k]: v } })
  const setSkin = <K extends keyof FacialAnatomy["skin_and_complexion"]>(k: K, v: string) =>
    onChange({ ...data, skin_and_complexion: { ...data.skin_and_complexion, [k]: v } })
  const setPigment = <K extends keyof FacialAnatomy["skin_and_complexion"]["pigmentation_and_color_zones"]>(k: K, v: string) =>
    onChange({ ...data, skin_and_complexion: { ...data.skin_and_complexion, pigmentation_and_color_zones: { ...data.skin_and_complexion.pigmentation_and_color_zones, [k]: v } } })
  const setAging = <K extends keyof FacialAnatomy["skin_and_complexion"]["aging_signs"]>(k: K, v: string) =>
    onChange({ ...data, skin_and_complexion: { ...data.skin_and_complexion, aging_signs: { ...data.skin_and_complexion.aging_signs, [k]: v } } })

  return (
    <Section id="facial-anatomy" title="Facial Anatomy">
      <SubHeading>Bone Structure</SubHeading>
      <FieldGrid>
        <SelectField label="Face Shape" value={data.bone_structure_and_proportions.face_shape} onChange={(v) => setBone("face_shape", v)} options={["Oval", "Square", "Heart", "Diamond", "Round", "Oblong", "Rectangle", "Triangle"]} />
        <TextField label="Jawline" value={data.bone_structure_and_proportions.jawline} onChange={(v) => setBone("jawline", v)} placeholder="e.g., sharp 110° angle" />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Chin" value={data.bone_structure_and_proportions.chin} onChange={(v) => setBone("chin", v)} options={["Pointed", "Cleft", "Soft/Rounded", "Flat", "Recessed", "Prominent", "Square"]} />
        <TextField label="Cheekbones" value={data.bone_structure_and_proportions.cheekbones} onChange={(v) => setBone("cheekbones", v)} placeholder="e.g., high, prominent, wide" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Forehead" value={data.bone_structure_and_proportions.forehead} onChange={(v) => setBone("forehead", v)} placeholder="Height, width, slope" />
        <TextField label="Brow Ridge" value={data.bone_structure_and_proportions.brow_ridge} onChange={(v) => setBone("brow_ridge", v)} placeholder="e.g., prominent, flat" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Temples" value={data.bone_structure_and_proportions.temples} onChange={(v) => setBone("temples", v)} placeholder="Hollow, full" />
        <TextField label="Facial Thirds" value={data.bone_structure_and_proportions.facial_thirds} onChange={(v) => setBone("facial_thirds", v)} placeholder="e.g., elongated midface" />
      </FieldGrid>

      <SubHeading>Soft Tissue</SubHeading>
      <FieldGrid>
        <SelectField label="Buccal Fat" value={data.soft_tissue_and_flesh.buccal_fat} onChange={(v) => setSoft("buccal_fat", v)} options={["Hollowed", "Average", "Plump/Cherubic"]} />
        <SelectField label="Nasolabial Folds" value={data.soft_tissue_and_flesh.nasolabial_folds} onChange={(v) => setSoft("nasolabial_folds", v)} options={["Invisible", "Faint shadows", "Moderate", "Deep creases"]} />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Tear Troughs" value={data.soft_tissue_and_flesh.tear_troughs} onChange={(v) => setSoft("tear_troughs", v)} placeholder="Hollowness under eye" />
        <TextField label="Under Chin" value={data.soft_tissue_and_flesh.submental_area} onChange={(v) => setSoft("submental_area", v)} placeholder="e.g., taut, slight double chin" />
      </FieldGrid>
      <SelectField label="Jowls" value={data.soft_tissue_and_flesh.jowls} onChange={(v) => setSoft("jowls", v)} options={["None", "Slight", "Moderate", "Prominent"]} />

      <SubHeading>Skin & Complexion</SubHeading>
      <FieldGrid>
        <TextField label="Base Tone" value={data.skin_and_complexion.base_tone} onChange={(v) => setSkin("base_tone", v)} placeholder="e.g., Type III warm olive" />
        <SelectField label="Undertone" value={data.skin_and_complexion.undertone} onChange={(v) => setSkin("undertone", v)} options={["Warm", "Cool", "Olive", "Neutral", "Peach"]} />
      </FieldGrid>
      <TextField label="Texture" value={data.skin_and_complexion.texture} onChange={(v) => setSkin("texture", v)} placeholder="Pore visibility, shine, dryness, elasticity" />

      <SubHeading>Pigmentation Zones</SubHeading>
      <FieldGrid>
        <TextField label="Under Eyes" value={data.skin_and_complexion.pigmentation_and_color_zones.under_eyes} onChange={(v) => setPigment("under_eyes", v)} placeholder="e.g., faint purple shadows" />
        <TextField label="Cheeks" value={data.skin_and_complexion.pigmentation_and_color_zones.cheeks} onChange={(v) => setPigment("cheeks", v)} placeholder="Flush, rosacea" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Mouth Area" value={data.skin_and_complexion.pigmentation_and_color_zones.mouth_area} onChange={(v) => setPigment("mouth_area", v)} placeholder="Shadowing, marionette lines" />
        <TextField label="Visible Veins" value={data.skin_and_complexion.pigmentation_and_color_zones.veins} onChange={(v) => setPigment("veins", v)} placeholder="e.g., blue veins at temples" />
      </FieldGrid>

      <SubHeading>Aging Signs</SubHeading>
      <FieldGrid>
        <TextField label="Fine Lines" value={data.skin_and_complexion.aging_signs.fine_lines} onChange={(v) => setAging("fine_lines", v)} placeholder="Location and severity" />
        <TextField label="Wrinkles" value={data.skin_and_complexion.aging_signs.wrinkles} onChange={(v) => setAging("wrinkles", v)} placeholder="Deep creases, furrows" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Elasticity" value={data.skin_and_complexion.aging_signs.elasticity} onChange={(v) => setAging("elasticity", v)} placeholder="Firm, sagging" />
        <TextField label="Sun Damage" value={data.skin_and_complexion.aging_signs.sun_damage} onChange={(v) => setAging("sun_damage", v)} placeholder="Spots, leathering" />
      </FieldGrid>
    </Section>
  )
}
