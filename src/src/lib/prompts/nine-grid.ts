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
    promptModifier: "left profile view, 90 degrees, neutral expression",
  },
  {
    cell: 3,
    label: "Right Profile",
    promptModifier: "right profile view, 90 degrees, neutral expression",
  },
  {
    cell: 4,
    label: "Frontal Smiling",
    promptModifier: "front-facing, warm genuine smile, studio lighting",
  },
  {
    cell: 5,
    label: "Frontal Expressive",
    promptModifier: "front-facing, surprised or intense expression",
  },
  {
    cell: 6,
    label: "3/4 Angle Neutral",
    promptModifier: "three-quarter angle view, neutral expression",
  },
  {
    cell: 7,
    label: "Looking Up",
    promptModifier: "front-facing, chin tilted up, eyes looking upward",
  },
  {
    cell: 8,
    label: "Looking Down",
    promptModifier: "front-facing, chin tilted down, eyes looking downward",
  },
  {
    cell: 9,
    label: "Harsh Lighting",
    promptModifier: "front-facing, dramatic side lighting, strong shadows",
  },
]

export function buildNineGridPrompt(
  masterPromptFragment: string,
  variant: GridVariant
): string {
  return `A photorealistic portrait of ${masterPromptFragment}. ${variant.promptModifier}. Plain background. 8K detail, professional photography.`
}
