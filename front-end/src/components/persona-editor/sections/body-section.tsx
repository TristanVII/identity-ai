"use client"

import { Section, TextField, SelectField, FieldGrid, SubHeading } from "../form-primitives"
import type { TorsoAndUpperBody, UpperLimbsAndHands } from "@/types/character-blueprint"

interface Props {
  torso: TorsoAndUpperBody
  limbs: UpperLimbsAndHands
  onChangeTorso: (d: TorsoAndUpperBody) => void
  onChangeLimbs: (d: UpperLimbsAndHands) => void
}

export function BodySection({ torso, limbs, onChangeTorso, onChangeLimbs }: Props) {
  const setNeck = <K extends keyof TorsoAndUpperBody["neck"]>(k: K, v: string) =>
    onChangeTorso({ ...torso, neck: { ...torso.neck, [k]: v } })
  const setShoulder = <K extends keyof TorsoAndUpperBody["shoulders"]>(k: K, v: string) =>
    onChangeTorso({ ...torso, shoulders: { ...torso.shoulders, [k]: v } })
  const setChest = <K extends keyof TorsoAndUpperBody["chest"]>(k: K, v: string) =>
    onChangeTorso({ ...torso, chest: { ...torso.chest, [k]: v } })
  const setArm = <K extends keyof UpperLimbsAndHands["arms"]>(k: K, v: string) =>
    onChangeLimbs({ ...limbs, arms: { ...limbs.arms, [k]: v } })
  const setHand = <K extends keyof UpperLimbsAndHands["hands"]>(k: K, v: string) =>
    onChangeLimbs({ ...limbs, hands: { ...limbs.hands, [k]: v } })
  const setNail = <K extends keyof UpperLimbsAndHands["nails"]>(k: K, v: string) =>
    onChangeLimbs({ ...limbs, nails: { ...limbs.nails, [k]: v } })

  return (
    <Section id="body" title="Upper Body & Hands">
      <SubHeading>Neck</SubHeading>
      <FieldGrid>
        <SelectField label="Length" value={torso.neck.length} onChange={(v) => setNeck("length", v)} options={["Short", "Average", "Long/Swan-like"]} />
        <SelectField label="Thickness" value={torso.neck.thickness} onChange={(v) => setNeck("thickness", v)} options={["Delicate", "Average", "Thick", "Muscular"]} />
      </FieldGrid>
      <TextField label="Features" value={torso.neck.features} onChange={(v) => setNeck("features", v)} placeholder="Adam's apple, visible muscles" />

      <SubHeading>Shoulders</SubHeading>
      <FieldGrid>
        <SelectField label="Width" value={torso.shoulders.width} onChange={(v) => setShoulder("width", v)} options={["Narrow", "Petite", "Average", "Broad", "Very broad"]} />
        <SelectField label="Slope" value={torso.shoulders.slope} onChange={(v) => setShoulder("slope", v)} options={["Square", "Slightly sloped", "Sloped", "Rounded"]} />
      </FieldGrid>
      <FieldGrid>
        <TextField label="Collarbones" value={torso.shoulders.collarbones} onChange={(v) => setShoulder("collarbones", v)} placeholder="Prominent, sharp, hidden" />
        <TextField label="Deltoids" value={torso.shoulders.deltoid_definition} onChange={(v) => setShoulder("deltoid_definition", v)} placeholder="Rounded, capped, flat" />
      </FieldGrid>

      <SubHeading>Chest</SubHeading>
      <FieldGrid>
        <TextField label="Build" value={torso.chest.build} onChange={(v) => setChest("build", v)} placeholder="e.g., defined pectorals, soft" />
        <TextField label="Sternum" value={torso.chest.sternum} onChange={(v) => setChest("sternum", v)} placeholder="Visible, flat, protruding" />
      </FieldGrid>

      <SubHeading>Arms</SubHeading>
      <FieldGrid>
        <TextField label="Tone" value={limbs.arms.thickness_and_tone} onChange={(v) => setArm("thickness_and_tone", v)} placeholder="Slender, muscled, soft" />
        <TextField label="Vascularity" value={limbs.arms.vascularity} onChange={(v) => setArm("vascularity", v)} placeholder="Ropey veins, invisible" />
      </FieldGrid>

      <SubHeading>Hands & Nails</SubHeading>
      <FieldGrid>
        <SelectField label="Hand Size" value={limbs.hands.size} onChange={(v) => setHand("size", v)} options={["Petite", "Proportional", "Large/Sprawling"]} />
        <TextField label="Fingers" value={limbs.hands.fingers} onChange={(v) => setHand("fingers", v)} placeholder="Long, stubby, crooked" />
      </FieldGrid>
      <FieldGrid>
        <SelectField label="Nail Shape" value={limbs.nails.shape} onChange={(v) => setNail("shape", v)} options={["Almond", "Square", "Round", "Stiletto", "Bitten", "Natural curve"]} />
        <TextField label="Nail Condition" value={limbs.nails.condition} onChange={(v) => setNail("condition", v)} placeholder="Clean, ridges, manicured" />
      </FieldGrid>
    </Section>
  )
}
