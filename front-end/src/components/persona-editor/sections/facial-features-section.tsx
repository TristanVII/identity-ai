"use client"

import { Section, TextField, SelectField, FieldGrid, SubHeading } from "../form-primitives"
import type { FacialFeatures } from "@/types/character-blueprint"

interface Props {
  data: FacialFeatures
  onChange: (d: FacialFeatures) => void
}

export function FacialFeaturesSection({ data, onChange }: Props) {
  const setEye = <K extends keyof FacialFeatures["eyes"]>(k: K, v: FacialFeatures["eyes"][K]) =>
    onChange({ ...data, eyes: { ...data.eyes, [k]: v } })
  const setIris = <K extends keyof FacialFeatures["eyes"]["iris"]>(k: K, v: string) =>
    onChange({ ...data, eyes: { ...data.eyes, iris: { ...data.eyes.iris, [k]: v } } })
  const setEyelid = (which: "upper" | "lower", v: string) =>
    onChange({ ...data, eyes: { ...data.eyes, eyelids: { ...data.eyes.eyelids, [which]: v } } })
  const setLash = (which: "upper" | "lower", v: string) =>
    onChange({ ...data, eyes: { ...data.eyes, eyelashes: { ...data.eyes.eyelashes, [which]: v } } })
  const setBrow = <K extends keyof FacialFeatures["eyebrows"]>(k: K, v: string) =>
    onChange({ ...data, eyebrows: { ...data.eyebrows, [k]: v } })
  const setNose = <K extends keyof FacialFeatures["nose"]>(k: K, v: string) =>
    onChange({ ...data, nose: { ...data.nose, [k]: v } })
  const setMouth = <K extends keyof FacialFeatures["mouth_and_lips"]>(k: K, v: FacialFeatures["mouth_and_lips"][K]) =>
    onChange({ ...data, mouth_and_lips: { ...data.mouth_and_lips, [k]: v } })
  const setTeeth = <K extends keyof FacialFeatures["teeth"]>(k: K, v: string) =>
    onChange({ ...data, teeth: { ...data.teeth, [k]: v } })
  const setEar = <K extends keyof FacialFeatures["ears"]>(k: K, v: string) =>
    onChange({ ...data, ears: { ...data.ears, [k]: v } })

  return (
    <Section id="facial-features" title="Facial Features">
      <SubHeading>Eyes</SubHeading>
      <FieldGrid>
        <SelectField label="Shape" value={data.eyes.shape} onChange={(v) => setEye("shape", v)} options={["Almond", "Round", "Monolid", "Hooded", "Deep-set", "Protruding", "Downturned"]} />
        <SelectField label="Canthal Tilt" value={data.eyes.canthal_tilt} onChange={(v) => setEye("canthal_tilt", v)} options={["Positive (upturned)", "Neutral", "Negative (downturned)", "Slight positive", "Slight negative"]} />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Size" value={data.eyes.size} onChange={(v) => setEye("size", v)} options={["Small", "Average", "Large", "Proportional"]} />
        <SelectField label="Spacing" value={data.eyes.spacing} onChange={(v) => setEye("spacing", v)} options={["Close-set", "Average", "Wide-set"]} />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Upper Eyelids" value={data.eyes.eyelids.upper} onChange={(v) => setEyelid("upper", v)} placeholder="Crease height, hooding" />
        <TextField label="Lower Eyelids" value={data.eyes.eyelids.lower} onChange={(v) => setEyelid("lower", v)} placeholder="Puffiness, aegyo sal" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Iris Color" value={data.eyes.iris.primary_color} onChange={(v) => setIris("primary_color", v)} placeholder="e.g., dark brown" />
        <TextField label="Secondary Color" value={data.eyes.iris.secondary_color} onChange={(v) => setIris("secondary_color", v)} placeholder="Flecks, heterochromia" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Upper Lashes" value={data.eyes.eyelashes.upper} onChange={(v) => setLash("upper", v)} placeholder="Length, density, curl" />
        <TextField label="Lower Lashes" value={data.eyes.eyelashes.lower} onChange={(v) => setLash("lower", v)} placeholder="Sparse, thick" />
      </FieldGrid>

      <SubHeading>Eyebrows</SubHeading>
      <FieldGrid>
        <SelectField label="Shape" value={data.eyebrows.shape} onChange={(v) => setBrow("shape", v)} options={["Straight", "Arched", "S-shaped", "Rounded", "Flat", "Angled"]} />
        <SelectField label="Thickness" value={data.eyebrows.thickness} onChange={(v) => setBrow("thickness", v)} options={["Sparse", "Thin", "Average", "Dense", "Overgrown"]} />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Color" value={data.eyebrows.color} onChange={(v) => setBrow("color", v)} placeholder="Shade relative to hair" />
        <SelectField label="Grooming" value={data.eyebrows.grooming} onChange={(v) => setBrow("grooming", v)} options={["Natural", "Threaded", "Waxed", "Filled in", "Microbladed", "Laminated"]} />
      </FieldGrid>

      <SubHeading>Nose</SubHeading>
      <FieldGrid>
        <SelectField label="Bridge" value={data.nose.bridge} onChange={(v) => setNose("bridge", v)} options={["Straight", "Convex (Roman)", "Concave", "Button", "Wide", "Narrow"]} />
        <SelectField label="Tip" value={data.nose.tip} onChange={(v) => setNose("tip", v)} options={["Bulbous", "Pointed", "Upturned", "Downturned", "Cleft", "Rounded"]} />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Nostrils" value={data.nose.nostrils} onChange={(v) => setNose("nostrils", v)} placeholder="Flare, front visibility" />
        <TextField label="Philtrum" value={data.nose.philtrum} onChange={(v) => setNose("philtrum", v)} placeholder="Length, groove depth" />
      </FieldGrid>

      <SubHeading>Mouth & Lips</SubHeading>
      <FieldGrid>
        <SelectField label="Cupid's Bow" value={data.mouth_and_lips.cupids_bow} onChange={(v) => setMouth("cupids_bow", v)} options={["Sharp", "Soft", "Flat", "Asymmetrical"]} />
        <TextField label="Lip Ratio" value={data.mouth_and_lips.lip_ratio} onChange={(v) => setMouth("lip_ratio", v)} placeholder="e.g., 1:1.5" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Upper Lip" value={data.mouth_and_lips.upper_lip} onChange={(v) => setMouth("upper_lip", v)} placeholder="Thickness, shape" />
        <TextField label="Lower Lip" value={data.mouth_and_lips.lower_lip} onChange={(v) => setMouth("lower_lip", v)} placeholder="Fullness, center weight" />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Natural Color" value={data.mouth_and_lips.natural_color} onChange={(v) => setMouth("natural_color", v)} placeholder="e.g., dusty rose" />
        <SelectField label="Mouth Corners" value={data.mouth_and_lips.mouth_corners} onChange={(v) => setMouth("mouth_corners", v)} options={["Upturned", "Neutral", "Downturned", "Dimpled"]} />
      </FieldGrid>

      <SubHeading>Teeth</SubHeading>
      <FieldGrid>
        <SelectField label="Color" value={data.teeth.color} onChange={(v) => setTeeth("color", v)} options={["Stark white", "Natural off-white", "Slightly yellow", "Stained"]} />
        <SelectField label="Alignment" value={data.teeth.alignment} onChange={(v) => setTeeth("alignment", v)} options={["Perfect", "Slight crowding", "Gaps", "Overbite", "Underbite"]} />
      </FieldGrid>

      <SubHeading>Ears</SubHeading>
      <FieldGrid>
        <SelectField label="Protrusion" value={data.ears.protrusion} onChange={(v) => setEar("protrusion", v)} options={["Pinned back", "Average", "Sticking out"]} />
        <SelectField label="Lobes" value={data.ears.lobes} onChange={(v) => setEar("lobes", v)} options={["Attached", "Detached", "Large", "Small"]} />
      </FieldGrid>
    </Section>
  )
}
