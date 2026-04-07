// Zod schema mirroring CharacterBlueprint types.
// Used for Gemini structured output (JSON schema enforcement).

import { z } from "zod"

const identifyingMark = z.object({
  type: z.string().describe("mole, scar, freckle, birthmark, capillary, vitiligo patch"),
  location: z.string().describe("Precise anatomical position"),
  size: z.string().describe("Approximate size in mm"),
  appearance: z.string().describe("e.g., raised dark brown, flat pale white"),
})

const tattoo = z.object({
  description: z.string().describe("Visual content of the tattoo"),
  location: z.string().describe("Exact placement on body"),
  size: z.string().describe("Approximate dimensions"),
  condition: z.string().describe("faded, blown-out, fresh, raised scarring"),
})

// 1. Character Metadata
const characterMetadata = z.object({
  name_or_id: z.string().describe("Leave empty — assigned by system"),
  base_archetype: z.string().describe("General facial/genetic description, e.g. '1970s French actress'"),
  apparent_age: z.string().describe("Exact age or narrow range, e.g. '27' or 'early 30s'"),
  gender_presentation: z.string().describe("How the character presents: Masculine, Feminine, Androgynous, Non-binary"),
  ethnic_phenotype: z.array(z.string()).describe("Specific genetic regions anchoring facial features"),
  body_type: z.string().describe("ectomorph, mesomorph, endomorph, athletic, slim, stocky, average"),
  overall_impression: z.string().describe("1-2 sentence vibe/energy description"),
})

// 2. Facial Anatomy
const boneStructure = z.object({
  facial_thirds: z.string().describe("Ratio of forehead:midface:lower face"),
  face_shape: z.string().describe("heart, square, oblong, diamond, oval, round"),
  jawline: z.string().describe("Angle degree, sharpness, width"),
  chin: z.string().describe("Length, projection, cleft/flat/pointed"),
  cheekbones: z.string().describe("Height, prominence, width"),
  forehead: z.string().describe("Height, width, slope, bossing"),
  temples: z.string().describe("Hollow, full, width vs cheekbones"),
  brow_ridge: z.string().describe("Prominent, flat, heavy, subtle"),
})

const softTissue = z.object({
  buccal_fat: z.string().describe("Hollowed cheeks, plump/cherubic, average"),
  nasolabial_folds: z.string().describe("Deep creases, faint shadows, invisible"),
  tear_troughs: z.string().describe("Hollowness or fullness under-eye"),
  submental_area: z.string().describe("Under-chin: taut, slight double chin, loose skin"),
  jowls: z.string().describe("None, slight, prominent"),
})

const skinComplexion = z.object({
  base_tone: z.string().describe("Fitzpatrick scale + exact shade"),
  undertone: z.string().describe("Warm, cool, olive, neutral, peach"),
  texture: z.string().describe("Pore visibility, peach fuzz, shine, dryness, elasticity"),
  identifying_marks: z.array(identifyingMark).describe("Moles, scars, freckles with precise locations"),
  pigmentation_and_color_zones: z.object({
    under_eyes: z.string().describe("Discoloration shade"),
    cheeks: z.string().describe("Natural flush, rosacea, hyperpigmentation"),
    mouth_area: z.string().describe("Shadowing, marionette lines"),
    forehead: z.string().describe("Sun spots, discoloration, oiliness"),
    veins: z.string().describe("Visible vascularity"),
  }),
  aging_signs: z.object({
    fine_lines: z.string().describe("Location and severity"),
    wrinkles: z.string().describe("Deeper creases, furrows"),
    elasticity: z.string().describe("Firm, beginning to sag, loose"),
    sun_damage: z.string().describe("Freckling, dark spots, leathering"),
  }),
})

const facialAsymmetries = z.object({
  left_side_quirks: z.array(z.string()),
  right_side_quirks: z.array(z.string()),
  overall_symmetry: z.string().describe("Near-perfect, slightly asymmetrical, noticeably asymmetrical"),
})

const facialAnatomy = z.object({
  bone_structure_and_proportions: boneStructure,
  soft_tissue_and_flesh: softTissue,
  skin_and_complexion: skinComplexion,
  asymmetries: facialAsymmetries,
})

// 3. Facial Features
const eyeDetails = z.object({
  shape: z.string().describe("Almond, round, monolid, hooded, deep-set, protruding"),
  canthal_tilt: z.string().describe("Neutral, positive (upturned), negative (downturned)"),
  size: z.string().describe("Large, small, average, proportional"),
  spacing: z.string().describe("Wide-set, close-set, average"),
  depth: z.string().describe("Deep-set, average, prominent/bulging"),
  eyelids: z.object({
    upper: z.string().describe("Crease height, epicanthic fold, hooding"),
    lower: z.string().describe("Puffiness, aegyo sal, tautness"),
  }),
  pupils: z.string().describe("Naturally dilated, pinpoint, anisocoria"),
  iris: z.object({
    primary_color: z.string(),
    secondary_color: z.string().describe("Heterochromia, flecks"),
    pattern: z.string().describe("Crypts, rings, sunburst"),
    limbal_ring: z.string().describe("Thickness and darkness"),
  }),
  sclera: z.string().describe("White tone, visible veins, clarity"),
  tear_ducts: z.string().describe("Exposed, fleshy, pointed, hidden"),
  eyelashes: z.object({
    upper: z.string().describe("Length, density, curl, color"),
    lower: z.string().describe("Sparse, thick, visibility"),
  }),
})

const eyebrowDetails = z.object({
  shape: z.string().describe("Straight, arched, S-shaped, rounded"),
  thickness: z.string().describe("Sparse, dense, overgrown, thin"),
  texture: z.string().describe("Unruly, laminated, individual hair visibility"),
  color: z.string().describe("Exact shade relative to hair color"),
  placement: z.string().describe("Distance from eyes, distance between brows"),
  grooming: z.string().describe("Natural, threaded, waxed, filled in, microbladed"),
})

const noseDetails = z.object({
  overall_size: z.string().describe("Proportion relative to face"),
  bridge: z.string().describe("Straight, convex, concave, width"),
  tip: z.string().describe("Bulbous, pointed, upturned, downturned, cleft"),
  nostrils: z.string().describe("Flare, visibility from front, shape"),
  septum: z.string().describe("Dropped, straight, deviated"),
  philtrum: z.string().describe("Length, depth of groove"),
  dorsum_width: z.string().describe("Narrow, medium, wide"),
})

const mouthAndLips = z.object({
  overall_width: z.string().describe("Narrow, wide, extending past pupils"),
  cupids_bow: z.string().describe("Sharp, soft, flat, asymmetrical"),
  upper_lip: z.string().describe("Thickness, shape, projection"),
  lower_lip: z.string().describe("Thickness, fullness, center weight"),
  lip_ratio: z.string().describe("Upper:lower ratio, e.g. 1:1.5"),
  natural_color: z.string().describe("Natural lip pigment"),
  texture: z.string().describe("Vertical lines, flakiness, natural gloss"),
  mouth_corners: z.string().describe("Upturned, downturned, dimples"),
  internal_details: z.object({
    gum_display: z.string().describe("Gingival display when smiling"),
    teeth_visibility: z.string().describe("How much teeth show at rest"),
  }),
})

const teethDetails = z.object({
  incisors: z.string(),
  canines: z.string(),
  color: z.string().describe("Stark white, natural off-white, stained"),
  alignment: z.string().describe("Perfect, crowding, gaps, overbite"),
  condition: z.string().describe("Pristine, worn, repaired, missing"),
})

const earDetails = z.object({
  size: z.string().describe("Proportion to head"),
  protrusion: z.string().describe("Pinned back, sticking out"),
  lobes: z.string().describe("Attached, detached, large, small"),
  shape: z.string().describe("Elven, rounded, cauliflower"),
  internal_cartilage: z.string().describe("Prominent tragus, pronounced antihelix, smooth"),
})

const facialFeatures = z.object({
  eyes: eyeDetails,
  eyebrows: eyebrowDetails,
  nose: noseDetails,
  mouth_and_lips: mouthAndLips,
  teeth: teethDetails,
  ears: earDetails,
})

// 4. Hair
const headHair = z.object({
  base_color: z.string(),
  highlights_and_undertones: z.string(),
  texture: z.string().describe("Straight (1a) to coily (4c), strand thickness"),
  density: z.string().describe("Thin, thick, voluminous, visible scalp"),
  hairline: z.string().describe("Widow's peak, straight, receding, uneven"),
  baby_hairs: z.string(),
  styling: z.object({
    parting: z.string(),
    cut_and_length: z.string(),
    current_state: z.string(),
    volume_distribution: z.string(),
  }),
  condition: z.string().describe("Healthy shine, damaged, dry, oily roots"),
})

const facialHair = z.object({
  presence: z.string().describe("None, peach fuzz, stubble, full beard"),
  pattern: z.string().describe("Even, patchy, goatee, soul patch"),
  texture_and_color: z.string(),
  length: z.string(),
})

const upperBodyHair = z.object({
  chest_and_abdomen: z.string(),
  arms_and_hands: z.string(),
  back_and_shoulders: z.string(),
})

const hairAndPilosity = z.object({
  head_hair: headHair,
  facial_hair: facialHair,
  upper_body_hair: upperBodyHair,
})

// 5. Torso
const neckAnatomy = z.object({
  length: z.string(), thickness: z.string(), features: z.string(), skin: z.string(),
})
const shoulderAnatomy = z.object({
  width: z.string(), slope: z.string(), collarbones: z.string(), deltoid_definition: z.string(),
})
const chestDetails = z.object({
  build: z.string(), bust_shape: z.string(), sternum: z.string(),
})
const upperBack = z.object({
  trapezius: z.string(), scapula: z.string(), spine_visibility: z.string(),
})
const torsoSkin = z.object({
  texture: z.string(), identifying_marks: z.array(identifyingMark),
})

const torsoAndUpperBody = z.object({
  neck: neckAnatomy,
  shoulders: shoulderAnatomy,
  chest: chestDetails,
  upper_back: upperBack,
  torso_skin: torsoSkin,
  posture_silhouette: z.string(),
})

// 6. Limbs
const armDetails = z.object({
  thickness_and_tone: z.string(), vascularity: z.string(), skin_condition: z.string(),
})
const handDetails = z.object({
  size: z.string(), fingers: z.string(), knuckles: z.string(), palms_and_texture: z.string(), wrist_bone: z.string(),
})
const nailDetails = z.object({
  shape: z.string(), length: z.string(), condition: z.string(),
})
const upperLimbs = z.object({
  arms: armDetails, hands: handDetails, nails: nailDetails,
})

// 7. Body Modifications
const bodyModifications = z.object({
  tattoos: z.array(tattoo),
  piercings: z.object({
    ears: z.array(z.string()), face: z.array(z.string()), mouth: z.array(z.string()), body: z.array(z.string()),
  }),
  scars_and_branding: z.array(z.string()),
  cosmetic_procedures: z.string(),
})

// 8. Expression
const expressionAndBody = z.object({
  default_resting_expression: z.string(),
  facial_micro_movements: z.object({
    forehead_tension: z.string(), eye_engagement: z.string(), mouth_tension: z.string(),
    nose_movement: z.string(), neck_and_jaw_tension: z.string(),
  }),
  posture_and_carriage: z.object({
    spine: z.string(), shoulder_carriage: z.string(), head_tilt: z.string(), hand_resting_position: z.string(),
  }),
  smile_description: z.string(),
})

// 9. Cosmetics
const cosmeticsAndGrooming = z.object({
  skincare_finish: z.string(),
  makeup: z.object({
    base: z.string(), contour_and_highlight: z.string(), eyes: z.string(),
    brows: z.string(), lips: z.string(), blush: z.string(),
  }),
  fragrance_vibe: z.string(),
})

// 10. Styling
const clothingDetails = z.object({
  neckline: z.string(), shoulder_fit: z.string(), sleeve_length: z.string(),
  fabric_details: z.string(), fit: z.string(), layering: z.string(),
})
const accessoryDetails = z.object({
  ears: z.array(z.string()), neck: z.array(z.string()), wrists_and_hands: z.array(z.string()),
  headwear: z.string(), eyewear: z.string(),
})
const upperBodyStyling = z.object({
  clothing: clothingDetails, accessories: accessoryDetails,
})

// 11. Consistency Anchors
const consistencyAnchors = z.object({
  must_keep_traits: z.array(z.string()).describe("5-8 most distinctive, non-negotiable features"),
  avoid_elements: z.array(z.string()).describe("Elements that would break consistency"),
  signature_colors: z.array(z.string()).describe("Recurring palette associated with the character"),
  lighting_notes: z.string().describe("Preferred lighting for consistency"),
})

// ── Top-level schema ─────────────────────────────────────────────────────────

export const characterBlueprintSchema = z.object({
  character_metadata: characterMetadata,
  facial_anatomy: facialAnatomy,
  facial_features: facialFeatures,
  hair_and_pilosity: hairAndPilosity,
  torso_and_upper_body: torsoAndUpperBody,
  upper_limbs_and_hands: upperLimbs,
  body_modifications: bodyModifications,
  expression_and_body_language: expressionAndBody,
  cosmetics_and_grooming: cosmeticsAndGrooming,
  upper_body_styling: upperBodyStyling,
  character_consistency_anchors: consistencyAnchors,
})

export type CharacterBlueprintZod = z.infer<typeof characterBlueprintSchema>
