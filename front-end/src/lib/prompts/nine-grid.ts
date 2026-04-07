export interface GridVariant {
  cell: number
  label: string
  promptModifier: string
}

export const NINE_GRID_VARIANTS: GridVariant[] = [
  {
    cell: 1,
    label: "Frontal Neutral",
    promptModifier: "front-facing, neutral expression, even studio lighting",
  },
  {
    cell: 2,
    label: "Left Profile",
    promptModifier: "left profile view, 90 degrees, neutral expression, soft fill light",
  },
  {
    cell: 3,
    label: "Right Profile",
    promptModifier: "right profile view, 90 degrees, neutral expression, soft fill light",
  },
  {
    cell: 4,
    label: "Frontal Smiling",
    promptModifier: "front-facing, warm genuine smile, even studio lighting",
  },
  {
    cell: 5,
    label: "Frontal Expressive",
    promptModifier: "front-facing, surprised expression, even studio lighting",
  },
  {
    cell: 6,
    label: "3/4 Angle Neutral",
    promptModifier: "three-quarter angle view, neutral expression, soft studio lighting",
  },
  {
    cell: 7,
    label: "Looking Up",
    promptModifier: "front-facing, chin tilted slightly up, eyes looking upward, even studio lighting",
  },
  {
    cell: 8,
    label: "Looking Down",
    promptModifier: "front-facing, chin tilted slightly down, eyes looking downward, even studio lighting",
  },
  {
    cell: 9,
    label: "Dramatic Lighting",
    promptModifier: "front-facing, dramatic Rembrandt side lighting, strong shadows on one side",
  },
]

export function buildNineGridPrompt(
  masterPromptFragment: string,
  variant: GridVariant
): string {
  return [
    "Photorealistic photograph of a real person.",
    `This person looks exactly like: ${masterPromptFragment}`,
    `Pose and angle: ${variant.promptModifier}.`,
    `This is cell ${variant.cell} of 9 in a reference grid — each cell MUST show a distinctly different angle and facial expression from the others.`,
    "Plain neutral gray background. Shot on a professional DSLR camera with an 85mm portrait lens, shallow depth of field.",
    "Do NOT stylize, do NOT use illustration or cartoon styles. This must look like a real unedited photograph of a real human being.",
    "Match the exact likeness, skin texture, and features from the reference image.",
  ].join(" ")
}
