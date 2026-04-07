// ─────────────────────────────────────────────────────────────────────────────
// CharacterBlueprint — exhaustive upper-body character description
// Used to generate consistent AI imagery across prompts.
// ─────────────────────────────────────────────────────────────────────────────

// ── Reusable sub-types ───────────────────────────────────────────────────────

export interface IdentifyingMark {
  type: string       // mole, scar, freckle, birthmark, capillary, vitiligo patch
  location: string   // precise anatomical position (e.g., "2mm below outer corner of left eye")
  size: string       // exact size in mm
  appearance: string // e.g., "raised dark brown", "flat pale white", "clustered"
}

export interface Tattoo {
  description: string // visual content (e.g., "traditional swallow", "abstract line art")
  location: string    // exact placement (e.g., "left collarbone", "right forearm inner")
  size: string        // approximate dimensions
  condition: string   // faded, blown-out, fresh, raised scarring
}

// ── Top-level blueprint ──────────────────────────────────────────────────────

export interface CharacterBlueprint {
  character_metadata: CharacterMetadata
  facial_anatomy: FacialAnatomy
  facial_features: FacialFeatures
  hair_and_pilosity: HairAndPilosity
  torso_and_upper_body: TorsoAndUpperBody
  upper_limbs_and_hands: UpperLimbsAndHands
  body_modifications: BodyModifications
  expression_and_body_language: ExpressionAndBodyLanguage
  cosmetics_and_grooming: CosmeticsAndGrooming
  upper_body_styling: UpperBodyStyling
  character_consistency_anchors: CharacterConsistencyAnchors
}

// ── 1. Character Metadata ────────────────────────────────────────────────────

export interface CharacterMetadata {
  name_or_id: string
  base_archetype: string        // e.g., "1970s French actress", "modern Korean street-style model"
  apparent_age: string           // exact age or narrow range (e.g., "27", "early 30s")
  gender_presentation: string    // how the character presents
  ethnic_phenotype: string[]     // specific genetic regions anchoring facial features
  body_type: string              // ectomorph, mesomorph, endomorph, athletic, slim, stocky
  overall_impression: string     // 1-2 sentence vibe/energy description for prompt guidance
}

// ── 2. Facial Anatomy ────────────────────────────────────────────────────────

export interface BoneStructureAndProportions {
  facial_thirds: string       // ratio of forehead:midface:lower face
  face_shape: string          // heart, square, oblong, diamond, oval, round
  jawline: string             // angle degree, sharpness, width
  chin: string                // length, projection, cleft/flat/pointed
  cheekbones: string          // height (high/low), prominence, width
  forehead: string            // height, width, slope, bossing
  temples: string             // hollow, full, width vs cheekbones
  brow_ridge: string          // prominent, flat, heavy, subtle
}

export interface SoftTissueAndFlesh {
  buccal_fat: string          // hollowed cheeks, plump/cherubic, average
  nasolabial_folds: string    // deep creases, faint shadows, invisible
  tear_troughs: string        // hollowness or fullness under-eye
  submental_area: string      // under-chin: taut, slight double chin, loose skin
  jowls: string               // none, slight, prominent
}

export interface SkinAndComplexion {
  base_tone: string           // Fitzpatrick scale + exact shade (e.g., "Type III, warm olive")
  undertone: string           // warm, cool, olive, neutral, peach
  texture: string             // pore visibility, peach fuzz, shine, dryness, elasticity
  identifying_marks: IdentifyingMark[]
  pigmentation_and_color_zones: {
    under_eyes: string        // discoloration shade (e.g., "faint purple/blue shadowing")
    cheeks: string            // natural flush, rosacea, hyperpigmentation
    mouth_area: string        // shadowing, marionette lines
    forehead: string          // sun spots, discoloration, oiliness
    veins: string             // visible vascularity (e.g., "blue veins at temples")
  }
  aging_signs: {
    fine_lines: string        // location and severity (e.g., "crow's feet, early forehead lines")
    wrinkles: string          // deeper creases, furrows
    elasticity: string        // firm, beginning to sag, loose
    sun_damage: string        // freckling, dark spots, leathering
  }
}

export interface FacialAsymmetries {
  left_side_quirks: string[]
  right_side_quirks: string[]
  overall_symmetry: string    // near-perfect, slightly asymmetrical, noticeably asymmetrical
}

export interface FacialAnatomy {
  bone_structure_and_proportions: BoneStructureAndProportions
  soft_tissue_and_flesh: SoftTissueAndFlesh
  skin_and_complexion: SkinAndComplexion
  asymmetries: FacialAsymmetries
}

// ── 3. Facial Features ───────────────────────────────────────────────────────

export interface EyeDetails {
  shape: string               // almond, round, monolid, hooded, deep-set, protruding
  canthal_tilt: string        // neutral, positive (upturned), negative (downturned) + severity
  size: string                // large, small, average, proportional
  spacing: string             // wide-set, close-set, average (interpupillary distance)
  depth: string               // deep-set, average, prominent/bulging
  eyelids: {
    upper: string             // crease height, epicanthic fold, hooding, visible lid space
    lower: string             // puffiness, aegyo sal, tautness
  }
  pupils: string              // naturally dilated, pinpoint, anisocoria
  iris: {
    primary_color: string
    secondary_color: string   // heterochromia, flecks
    pattern: string           // crypts, rings, sunburst
    limbal_ring: string       // thickness and darkness
  }
  sclera: string              // white tone, visible veins, clarity
  tear_ducts: string          // exposed, fleshy, pointed, hidden
  eyelashes: {
    upper: string             // length, density, curl, color, clumping
    lower: string             // sparse, thick, visibility
  }
}

export interface EyebrowDetails {
  shape: string               // straight, arched, S-shaped, rounded
  thickness: string           // sparse, dense, overgrown, thin
  texture: string             // unruly, laminated, individual hair visibility
  color: string               // exact shade relative to hair color
  placement: string           // distance from eyes, distance between brows
  grooming: string            // natural, threaded, waxed, filled in, microbladed
}

export interface NoseDetails {
  overall_size: string        // proportion relative to face
  bridge: string              // straight, convex, concave, width, bump location
  tip: string                 // bulbous, pointed, upturned, downturned, cleft
  nostrils: string            // flare, visibility from front, shape
  septum: string              // dropped, straight, deviated
  philtrum: string            // length, depth of groove
  dorsum_width: string        // narrow, medium, wide at various points
}

export interface MouthAndLipDetails {
  overall_width: string       // narrow, wide, extending past pupils
  cupids_bow: string          // sharp, soft, flat, asymmetrical
  upper_lip: string           // thickness, shape, projection
  lower_lip: string           // thickness, fullness, center weight
  lip_ratio: string           // upper:lower (e.g., "1:1.5")
  natural_color: string       // natural lip pigment (e.g., "dusty rose", "pale pink", "deep mauve")
  texture: string             // vertical lines, flakiness, natural gloss, matte
  mouth_corners: string       // upturned, downturned, dimples, resting state
  internal_details: {
    gum_display: string       // gingival display when smiling, color
    teeth_visibility: string  // how much teeth show at rest or parted
  }
}

export interface TeethDetails {
  incisors: string            // bunny teeth, straight, gaps, chipped
  canines: string             // sharp/vampiric, rounded, flat
  color: string               // stark white, natural off-white, stained
  alignment: string           // perfect, crowding, gaps, overbite, underbite
  condition: string           // pristine, worn, repaired, missing
}

export interface EarDetails {
  size: string                // proportion to head
  protrusion: string          // pinned back, sticking out
  lobes: string               // attached, detached, large, small
  shape: string               // elven, rounded, cauliflower
  internal_cartilage: string  // prominent tragus, pronounced antihelix, smooth
}

export interface FacialFeatures {
  eyes: EyeDetails
  eyebrows: EyebrowDetails
  nose: NoseDetails
  mouth_and_lips: MouthAndLipDetails
  teeth: TeethDetails
  ears: EarDetails
}

// ── 4. Hair & Pilosity ───────────────────────────────────────────────────────

export interface HeadHair {
  base_color: string          // root color and primary shade
  highlights_and_undertones: string // balayage, brassiness, sun-bleached
  texture: string             // straight (1a) to coily (4c), strand thickness
  density: string             // thin, thick, shedding, voluminous, visible scalp
  hairline: string            // widow's peak, straight, receding, uneven, cowlicks
  baby_hairs: string          // presence and styling around forehead/temples
  styling: {
    parting: string           // exact part location (e.g., "messy left-side part")
    cut_and_length: string    // length and layer style relative to shoulders/neck
    current_state: string     // tucked behind ears, windblown, slicked, messy
    volume_distribution: string // flat on top, voluminous at roots, heavy at ends
  }
  condition: string           // healthy shine, damaged/split ends, dry, oily roots
}

export interface FacialHair {
  presence: string            // none, peach fuzz, stubble, full beard, mustache, sideburns
  pattern: string             // even coverage, patchy, goatee, soul patch, chin strap
  texture_and_color: string   // coarseness, exact color, grooming level
  length: string              // 5 o'clock shadow, 3-day stubble, full-length, trimmed
}

export interface UpperBodyHair {
  chest_and_abdomen: string   // sparse, thick, none, treasure trail
  arms_and_hands: string      // coarse dark forearm hair, faint peach fuzz, hairy knuckles
  back_and_shoulders: string  // none, light dusting, noticeable
}

export interface HairAndPilosity {
  head_hair: HeadHair
  facial_hair: FacialHair
  upper_body_hair: UpperBodyHair
}

// ── 5. Torso & Upper Body ────────────────────────────────────────────────────

export interface NeckAnatomy {
  length: string              // swan-like, short, average
  thickness: string           // thick, delicate, muscular
  features: string            // Adam's apple, sternocleidomastoid visibility, folds
  skin: string                // creasing, "tech neck" lines, smooth
}

export interface ShoulderAnatomy {
  width: string               // broad, narrow, petite
  slope: string               // square, sloped, rounded
  collarbones: string         // highly prominent, sharp, soft, hidden
  deltoid_definition: string  // rounded, capped, flat, barely visible
}

export interface ChestDetails {
  build: string               // defined pectorals, soft tissue, visible ribcage/sternum
  bust_shape: string          // size, shape, cleavage visibility (if applicable)
  sternum: string             // visible, flat, protruding
}

export interface UpperBackDetails {
  trapezius: string           // heavily developed, slope into shoulders, flat
  scapula: string             // winging/protruding, hidden
  spine_visibility: string    // visible vertebrae, hidden, slight ridge
}

export interface TorsoSkin {
  texture: string             // matches facial tone, stretch marks, sun damage, chest redness
  identifying_marks: IdentifyingMark[]
}

export interface TorsoAndUpperBody {
  neck: NeckAnatomy
  shoulders: ShoulderAnatomy
  chest: ChestDetails
  upper_back: UpperBackDetails
  torso_skin: TorsoSkin
  posture_silhouette: string  // how the torso naturally sits in frame at rest
}

// ── 6. Upper Limbs & Hands ───────────────────────────────────────────────────

export interface ArmDetails {
  thickness_and_tone: string  // slender, muscled (bicep/tricep definition), soft
  vascularity: string         // ropey veins, invisible, translucent skin
  skin_condition: string      // keratosis pilaris, smooth, freckled, tanned
}

export interface HandDetails {
  size: string                // large, petite, proportional
  fingers: string             // long/spindly, stubby, crooked, double-jointed
  knuckles: string            // calloused, red, smooth, prominent
  palms_and_texture: string   // rough, soft, wrinkled
  wrist_bone: string          // prominent ulnar styloid, thick wrists, delicate
}

export interface NailDetails {
  shape: string               // almond, square, bitten, natural curve
  length: string              // long extensions, short, trimmed
  condition: string           // clean, ridges, chipped polish, manicured, bitten
}

export interface UpperLimbsAndHands {
  arms: ArmDetails
  hands: HandDetails
  nails: NailDetails
}

// ── 7. Body Modifications ────────────────────────────────────────────────────

export interface BodyModifications {
  tattoos: Tattoo[]
  piercings: {
    ears: string[]            // exact metal, stone, placement per piercing
    face: string[]            // septum rings, eyebrow piercings, dermal anchors
    mouth: string[]           // tongue piercing, lip piercing
    body: string[]            // navel, nipple, dermals on collarbones
  }
  scars_and_branding: string[] // non-accidental scarring, scarification, medical ports
  cosmetic_procedures: string  // filler, botox, rhinoplasty (affects rendered shape)
}

// ── 8. Expression & Body Language ────────────────────────────────────────────

export interface FacialMicroMovements {
  forehead_tension: string    // furrowed, relaxed, raised brows
  eye_engagement: string      // squinting, wide-eyed, relaxed, asymmetrical squint
  mouth_tension: string       // relaxed, pursed, biting lip, smirk
  nose_movement: string       // nostril flare at rest, scrunching tendency
  neck_and_jaw_tension: string // jaw clenching, relaxed, tendons showing
}

export interface PostureAndCarriage {
  spine: string               // slouched, military straight, arched back
  shoulder_carriage: string   // hunched, asymmetrical drop, relaxed
  head_tilt: string           // habitual tilt direction, chin up/down tendency
  hand_resting_position: string // in pockets, folded arms, at sides, fidgeting
}

export interface ExpressionAndBodyLanguage {
  default_resting_expression: string // the "neutral face" — resting b*tch face, soft, vacant, alert
  facial_micro_movements: FacialMicroMovements
  posture_and_carriage: PostureAndCarriage
  smile_description: string   // gummy, closed-lip, asymmetrical, dimples, teeth visibility
}

// ── 9. Cosmetics & Grooming ──────────────────────────────────────────────────

export interface MakeupDetails {
  base: string                // heavy foundation, sheer tint, bare face, baking
  contour_and_highlight: string // placement and intensity on cheekbones/nose/jaw
  eyes: string                // shadow colors, liner style, mascara, false lashes
  brows: string               // penciled, pomade, natural, laminated
  lips: string                // lip liner, shade, gloss level, smudged edges
  blush: string               // color, placement (e.g., "soft pink on apples"), draping style
}

export interface CosmeticsAndGrooming {
  skincare_finish: string     // matte, dewy, sweaty, oily, flaky
  makeup: MakeupDetails
  fragrance_vibe: string      // not for image gen, but helps set character tone in prompts
}

// ── 10. Upper Body Styling ───────────────────────────────────────────────────

export interface ClothingDetails {
  neckline: string            // deep v-neck, turtleneck, cowl, bare shoulders
  shoulder_fit: string        // off-shoulder, structured pads, spaghetti straps
  sleeve_length: string       // sleeveless, cap, rolled forearms, long
  fabric_details: string      // material, texture, color, pattern
  fit: string                 // oversized, tailored, skin-tight, draped
  layering: string            // visible undershirt, jacket over shirt, single layer
}

export interface AccessoryDetails {
  ears: string[]              // e.g., "small gold hoops on lobes", "industrial piercing"
  neck: string[]              // chokers, chains, pendants
  wrists_and_hands: string[]  // watches, bracelets, rings with finger placement
  headwear: string            // hats, clips, headbands
  eyewear: string             // glasses shape, frame material, thickness, lens tint
}

export interface UpperBodyStyling {
  clothing: ClothingDetails
  accessories: AccessoryDetails
}

// ── 11. Consistency Anchors ──────────────────────────────────────────────────

export interface CharacterConsistencyAnchors {
  must_keep_traits: string[]  // non-negotiable defining features (e.g., "mole under left eye")
  avoid_elements: string[]    // things that would break consistency (e.g., "symmetrical face")
  signature_colors: string[]  // recurring palette associated with the character
  lighting_notes: string      // preferred lighting direction / mood for consistency
}
