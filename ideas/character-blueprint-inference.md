# Character Blueprint — Inference Architecture

## Overview

The `CharacterBlueprint` is an exhaustive JSON object describing a character's upper-body appearance. It is the **source of truth** for generating consistent AI imagery across prompts.

## How It Gets Filled

### Primary Method: Gemini Vision Inference

When a user uploads a reference photo, we send it to **Gemini** with structured output (JSON schema response) to extract the blueprint automatically.

```
User uploads photo
       ↓
POST /api/analyze
       ↓
Gemini (gemini-2.5-flash / gemini-3.1-flash)
  + reference image (base64)
  + system prompt (see below)
  + responseSchema: CharacterBlueprint JSON schema
       ↓
Returns filled CharacterBlueprint JSON
       ↓
Stored on persona record → hidden_metadata
```

### Secondary Method: Manual Form

The user can also fill in or override any field via the TraitEditor form UI.
The form is organized by the same section hierarchy as the blueprint.

## Gemini Structured Output

Gemini supports `responseMimeType: "application/json"` with a `responseSchema` parameter.
This guarantees the response conforms to our exact JSON shape — no parsing needed.

```typescript
const model = genai.getGenerativeModel({
  model: IMAGE_MODEL,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: characterBlueprintSchema, // JSON Schema object
  },
})

const result = await model.generateContent([
  { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
  ANALYZE_SYSTEM_PROMPT,
])

const blueprint: CharacterBlueprint = JSON.parse(result.response.text())
```

## System Prompt Strategy

The analyze prompt instructs Gemini to:

1. **Observe exhaustively** — describe everything visible, no assumptions
2. **Be precise** — use anatomical terms, measurements where possible
3. **Flag uncertainty** — if a feature is occluded (hair covering ears, etc.), note it as `"not visible — occluded by [reason]"` rather than guessing
4. **Anchor consistency** — auto-populate `must_keep_traits` with the 5-8 most distinctive/unique features
5. **Fill `avoid_elements`** — list things that would break this character (e.g., if the face is noticeably asymmetrical, avoid "symmetrical face")

## JSON Schema for Gemini

The Gemini `responseSchema` uses a subset of JSON Schema (OpenAPI 3.0 style).
Key rules:
- Use `type: "object"` with `properties` and `required`
- Use `type: "array"` with `items` for arrays
- Use `type: "string"` for all descriptive fields
- Nested objects are fully expanded (no `$ref`)
- Every field must be in `required` to ensure Gemini fills it

The schema is auto-generated from the TypeScript types at:
`src/types/character-blueprint.ts`

## File Locations

| File | Purpose |
|------|---------|
| `src/types/character-blueprint.ts` | TypeScript interfaces |
| `src/types/character-blueprint-defaults.ts` | Empty defaults for form init |
| `src/lib/prompts/analyze.ts` | System prompt for Gemini inference |
| `src/app/api/analyze/route.ts` | API route that runs inference |

## Multi-Photo Refinement (Future)

For better accuracy, allow multiple reference photos (different angles, lighting).
Each photo produces a partial blueprint → merge with conflict resolution:
- **Consensus wins**: if 2/3 photos say "almond eyes", use that
- **Most detailed wins**: if one photo shows ears clearly and others don't, use that one's ear data
- **Flag conflicts**: if photos disagree (different lighting = different skin tone), note both and let the user pick
