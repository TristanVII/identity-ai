export interface TraitInputs {
  age: number | null
  ethnicity: string
  gender: string
  hair_color: string
  hair_texture: string
  hair_length: string
  eye_color: string
  eye_shape: string
  face_shape: string
  jawline: string
  chin: string
  cheekbone_height: string
  cheekbone_prominence: string
  forehead: string
  canthal_tilt: string
  eyebrows: string
  nose_bridge: string
  nose_tip: string
  nose_width: string
  lip_fullness: string
  lip_color: string
  skin_tone: string
  skin_texture: string
  blemishes: string
  facial_hair: string
}

export interface HiddenMetadata {
  base_demographics: {
    age: number
    ethnicity: string
    gender: string
  }
  facial_structure: {
    face_shape: string
    jawline: string
    chin: string
    cheekbone_height: string
    cheekbone_prominence: string
    forehead: string
  }
  eyes: {
    color: string
    shape: string
    canthal_tilt: string
    size: string
    spacing: string
    eyebrows: string
    eyelashes: string
  }
  nose: {
    bridge: string
    tip: string
    width: string
    nostril_shape: string
  }
  mouth: {
    lip_fullness: string
    lip_color: string
    corners: string
    width: string
    philtrum: string
  }
  skin_hair: {
    hair_color: string
    hair_texture: string
    hair_length: string
    hair_style: string
    skin_tone: string
    skin_texture: string
    blemishes: string
    facial_hair: string
  }
  master_prompt_fragment: string
}

export type PersonaStatus = "draft" | "finalizing" | "ready" | "error"

export interface Persona {
  id: string
  name: string
  source_image_url: string | null
  nine_grid_url: string | null
  hidden_metadata: HiddenMetadata | Record<string, never>
  trait_inputs: TraitInputs | Record<string, never>
  status: PersonaStatus
  created_at: string
  updated_at: string
}

export const DEFAULT_TRAIT_INPUTS: TraitInputs = {
  age: null,
  ethnicity: "",
  gender: "",
  hair_color: "",
  hair_texture: "",
  hair_length: "",
  eye_color: "",
  eye_shape: "",
  face_shape: "",
  jawline: "",
  chin: "",
  cheekbone_height: "",
  cheekbone_prominence: "",
  forehead: "",
  canthal_tilt: "",
  eyebrows: "",
  nose_bridge: "",
  nose_tip: "",
  nose_width: "",
  lip_fullness: "",
  lip_color: "",
  skin_tone: "",
  skin_texture: "",
  blemishes: "",
  facial_hair: "",
}
