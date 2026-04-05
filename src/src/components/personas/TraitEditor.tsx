"use client"

import { Field, Select } from "@fluentui/react-components"
import { Input } from "@fluentui/react-components"
import type { TraitInputs } from "@/types/persona"

interface TraitEditorProps {
  traits: TraitInputs
  onChange: (traits: TraitInputs) => void
  showAdvanced: boolean
}

const OPTIONS: Record<string, string[]> = {
  gender: ["female", "male", "non_binary"],
  ethnicity: ["caucasian", "african", "east_asian", "south_asian", "southeast_asian", "middle_eastern", "hispanic_latino", "mixed_asian_caucasian", "mixed_african_caucasian", "other"],
  face_shape: ["oval", "round", "square", "heart", "oblong"],
  eye_color: ["brown", "blue", "green", "hazel", "gray", "amber"],
  eye_shape: ["almond", "round", "hooded", "monolid", "downturned"],
  hair_color: ["black", "dark_brunette", "light_brunette", "blonde", "red", "auburn", "gray", "white"],
  hair_texture: ["straight", "wavy", "curly", "coily"],
  hair_length: ["short", "medium", "long", "very_long"],
  skin_tone: ["fair", "light_olive", "medium", "tan", "dark_brown", "deep"],
  jawline: ["soft_v_shape", "angular", "rounded", "wide"],
  chin: ["slightly_pointed", "rounded", "cleft", "prominent"],
  cheekbone_height: ["high", "medium", "low"],
  cheekbone_prominence: ["prominent", "subtle", "flat"],
  forehead: ["high", "average", "low", "wide", "narrow"],
  canthal_tilt: ["positive", "neutral", "negative"],
  eyebrows: ["thick_arched", "thin_straight", "bushy", "feathered"],
  nose_bridge: ["straight", "arched", "flat", "bumped"],
  nose_tip: ["slightly_upturned", "downturned", "rounded", "pointed"],
  nose_width: ["narrow", "average", "wide"],
  lip_fullness: ["full", "thin", "full_lower_lip", "full_upper_lip"],
  lip_color: ["pink", "dark_pink", "neutral", "brown_toned"],
  skin_texture: ["smooth", "textured", "pores_visible"],
  blemishes: ["none", "freckles_on_nose", "beauty_mark_left_cheek", "acne_scars"],
  facial_hair: ["none", "stubble", "full_beard", "mustache", "goatee"],
}

function SelectField({
  label,
  value,
  field,
  onChange,
}: {
  label: string
  value: string
  field: string
  onChange: (field: string, value: string) => void
}) {
  return (
    <Field label={label} size="small">
      <Select
        value={value || ""}
        onChange={(_e, data) => onChange(field, data.value)}
        appearance="filled-darker"
      >
        <option value="">Select…</option>
        {(OPTIONS[field] || []).map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </Select>
    </Field>
  )
}

const BASIC_FIELDS = [
  "gender", "ethnicity", "face_shape", "eye_color", "eye_shape",
  "hair_color", "hair_texture", "hair_length", "skin_tone",
]

const ADVANCED_FIELDS = [
  "jawline", "chin", "cheekbone_height", "cheekbone_prominence", "forehead",
  "canthal_tilt", "eyebrows", "nose_bridge", "nose_tip", "nose_width",
  "lip_fullness", "lip_color", "skin_texture", "blemishes", "facial_hair",
]

export function TraitEditor({ traits, onChange, showAdvanced }: TraitEditorProps) {
  function update(field: string, value: string | number | null) {
    onChange({ ...traits, [field]: value })
  }

  const labelStyle = {
    fontSize: "var(--text-overline)" as const,
    fontWeight: 600 as const,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--text-subtle)",
    marginBottom: 16,
  }

  return (
    <div>
      <p style={labelStyle}>Basic Traits</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        <Field label="Age" size="small">
          <Input
            type="number"
            min={1}
            max={120}
            value={traits.age?.toString() ?? ""}
            onChange={(_e, data) => update("age", data.value ? Number(data.value) : null)}
            appearance="filled-darker"
          />
        </Field>
        {BASIC_FIELDS.map((field) => (
          <SelectField
            key={field}
            label={field.replace(/_/g, " ")}
            value={(traits as unknown as Record<string, string>)[field] || ""}
            field={field}
            onChange={update}
          />
        ))}
      </div>

      {showAdvanced && (
        <>
          <p style={{ ...labelStyle, marginTop: 32 }}>Advanced Traits</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {ADVANCED_FIELDS.map((field) => (
              <SelectField
                key={field}
                label={field.replace(/_/g, " ")}
                value={(traits as unknown as Record<string, string>)[field] || ""}
                field={field}
                onChange={update}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
