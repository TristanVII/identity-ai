# Technical Specification: PersonaSync Studio

## 1. Overview

This document is the full technical blueprint for building PersonaSync Studio — a web application that solves AI character consistency across image and video generation. It translates every requirement from the PRD into concrete architecture, data models, APIs, and implementation guidance.

**Core Problem:** Maintaining identical facial likeness across AI-generated images/videos is unreliable with ad-hoc prompting. PersonaSync solves this by persisting a structured character descriptor (hidden JSON) and a multi-angle reference image sheet (9-grid) for every persona, then automatically merging these into every generation request.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 (App Router, React 19) | SSR/SSG flexibility, API routes co-located, strong ecosystem |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **Backend / API** | Next.js Route Handlers (App Router) | Co-located with frontend, handles all API logic |
| **Orchestration** | Aspire AppHost (C#) | Orchestrates the Next.js app, Azure PostgreSQL, Azure Blob Storage via a unified dev/deploy experience. JS apps are first-class citizens in Aspire 13+. |
| **Database** | Azure Database for PostgreSQL – Flexible Server | First-class JSON/JSONB support for hidden metadata, relational integrity, managed Azure service |
| **ORM** | Drizzle ORM | Type-safe, lightweight, excellent PostgreSQL support |
| **File Storage** | Azure Blob Storage | Stores uploaded reference images, 9-grid sheets, generated images, uploaded/generated videos |
| **AI – Text/Orchestration** | Google Gemini Flash (latest) | Prompt interpretation, image reverse-engineering, prompt merging |
| **AI – Image Generation** | Google Imagen 3 (via Gemini API) | Live previews, 9-grid reference generation, scenario image generation |
| **AI – Video / Face-Swap** | Kling AI API | Face-swap persona onto uploaded reference videos |
| **Deployment** | Azure Container Apps (via Aspire) | `aspire publish` generates deployment manifests for Azure Container Apps; Next.js runs as a containerized app |

**State Management:** No external library. Active persona is tracked via URL search params (`?persona=uuid`). Server data is fetched with standard `fetch` in Server Components or simple custom hooks. Page-local state uses `useState`/`useReducer`. See §7.3 for details.

**Async Operations:** All API calls are standard request/response. The only long-running operation (Kling video processing, 1–5 min) uses client-side polling (`GET /api/video/status/:id` every 5s). No SSE, WebSockets, or realtime infrastructure needed.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     ASPIRE APPHOST (C#)                           │
│  Orchestrates all services for local dev & Azure deployment       │
│                                                                   │
│  builder.AddJavaScriptApp("frontend", "./frontend")               │
│  builder.AddAzurePostgresFlexibleServer("db")                     │
│  builder.AddAzureBlobStorage("blobs")                             │
└────────────────────────┬──────────────────────────────────────────┘
                         │ manages
┌────────────────────────┼──────────────────────────────────────────┐
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │                   CLIENT (Next.js)                       │     │
│  │                                                          │     │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────────┐     │     │
│  │  │ Studio   │  │ Playground   │  │  Motion Lab    │     │     │
│  │  │ (Create) │  │ (Image Gen)  │  │  (Video Swap)  │     │     │
│  │  └────┬─────┘  └──────┬───────┘  └───────┬────────┘     │     │
│  │       └───────────────┼──────────────────┘               │     │
│  │                       │                                  │     │
│  │          URL params + useState + fetch                   │     │
│  │       (no external state management library)             │     │
│  └───────────────────────┬──────────────────────────────────┘     │
│                          │ HTTPS (JSON)                           │
│  ┌───────────────────────┼──────────────────────────────────┐     │
│  │           NEXT.JS API ROUTE HANDLERS                     │     │
│  │                                                          │     │
│  │  /api/personas      CRUD for persona objects             │     │
│  │  /api/analyze       Reverse-engineer uploaded face       │     │
│  │  /api/preview       Generate live preview headshot       │     │
│  │  /api/finalize      Generate hidden JSON + 9-grid        │     │
│  │  /api/generate      Merge prompt + persona → image       │     │
│  │  /api/video/submit  Submit video face-swap job           │     │
│  │  /api/video/status  Poll job status (client polls)       │     │
│  │                                                          │     │
│  │      ┌──────────────┼───────────────┐                    │     │
│  │      │              │               │                    │     │
│  │ ┌────▼────┐  ┌──────▼──────┐ ┌──────▼──────┐            │     │
│  │ │ Gemini  │  │  Imagen 3   │ │  Kling AI   │            │     │
│  │ │ Flash   │  │  (via       │ │  API        │            │     │
│  │ │ API     │  │  Gemini)    │ │             │            │     │
│  │ └─────────┘  └─────────────┘ └─────────────┘            │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────────────┐       │
│  │  Azure PostgreSQL    │  │  Azure Blob Storage          │       │
│  │  Flexible Server     │  │                              │       │
│  │  ┌────────────────┐  │  │  ┌────────────┐ ┌─────────┐ │       │
│  │  │ personas       │  │  │  │ source-    │ │ nine-   │ │       │
│  │  │ generations    │  │  │  │ images     │ │ grids   │ │       │
│  │  │ video_jobs     │  │  │  ├────────────┤ ├─────────┤ │       │
│  │  └────────────────┘  │  │  │ generated- │ │ videos- │ │       │
│  │                      │  │  │ images     │ │ input/  │ │       │
│  │                      │  │  │            │ │ output  │ │       │
│  │                      │  │  └────────────┘ └─────────┘ │       │
│  └──────────────────────┘  └──────────────────────────────┘       │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

All tables live in Azure Database for PostgreSQL – Flexible Server. UUIDs are used for all primary keys.

### 4.1 `personas`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique persona identifier |
| `name` | `text` | NOT NULL | User-facing persona name |
| `source_image_url` | `text` | NULLABLE | URL in Azure Blob Storage for the uploaded reference face |
| `nine_grid_url` | `text` | NULLABLE | URL of the generated 9-grid reference sheet |
| `hidden_metadata` | `jsonb` | NOT NULL, default `'{}'` | The structured character descriptor (never exposed to UI) |
| `trait_inputs` | `jsonb` | NOT NULL, default `'{}'` | The user-facing trait values (sliders/dropdowns state) for re-editing |
| `status` | `text` | NOT NULL, default `'draft'` | `draft` → `finalizing` → `ready` → `error` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Auto-updated via trigger |

### 4.2 `generations`

Stores every image generation request and result.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `persona_id` | `uuid` | FK → `personas.id`, NOT NULL | Which persona was used |
| `type` | `text` | NOT NULL | `image` or `video` |
| `user_prompt` | `text` | NOT NULL | Raw user input from chat |
| `merged_prompt` | `text` | NULLABLE | The full prompt sent to the image/video model (for debugging) |
| `result_url` | `text` | NULLABLE | URL of the generated asset in Storage |
| `status` | `text` | NOT NULL, default `'pending'` | `pending` → `processing` → `completed` → `failed` |
| `error_message` | `text` | NULLABLE | If status = `failed` |
| `metadata` | `jsonb` | default `'{}'` | Model-specific params, timings, etc. |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |

### 4.3 `video_jobs`

Tracks async Kling AI processing separately due to long runtimes.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `generation_id` | `uuid` | FK → `generations.id`, UNIQUE | Links to parent generation record |
| `kling_task_id` | `text` | NULLABLE | External task ID returned by Kling API |
| `input_video_url` | `text` | NOT NULL | URL of uploaded reference video |
| `status` | `text` | NOT NULL, default `'submitted'` | `submitted` → `processing` → `completed` → `failed` |
| `progress` | `integer` | default `0` | 0–100 percentage |
| `result_video_url` | `text` | NULLABLE | Final output video URL |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

### 4.4 Database Indexes

```sql
CREATE INDEX idx_generations_persona ON generations(persona_id);
CREATE INDEX idx_generations_status  ON generations(status);
CREATE INDEX idx_video_jobs_status   ON video_jobs(status);
CREATE INDEX idx_personas_status     ON personas(status);
```

### 4.5 `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON video_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 5. Azure Blob Storage Containers

| Container | Access | Contents |
|---|---|---|
| `source-images` | Private | Uploaded reference face images |
| `nine-grids` | Private | Generated 9-grid reference sheets |
| `generated-images` | Private | Output from Imagen 3 scenario generations |
| `videos-input` | Private | Uploaded reference videos (TikTok dances, etc.) |
| `videos-output` | Private | Processed face-swap videos from Kling |

All assets accessed via SAS (Shared Access Signature) URLs with configurable expiry (default 1 hour). No public containers in MVP. The `@azure/storage-blob` SDK is used server-side for uploads, downloads, and SAS URL generation.

---

## 6. API Design

All endpoints are Next.js Route Handlers under `app/api/`. Request/response bodies are JSON unless noted.

### 6.1 Persona CRUD

#### `GET /api/personas`
Returns all personas for the gallery sidebar.

**Response:**
```json
{
  "personas": [
    {
      "id": "uuid",
      "name": "string",
      "nine_grid_url": "string | null",
      "status": "draft | finalizing | ready | error",
      "created_at": "ISO8601"
    }
  ]
}
```

#### `POST /api/personas`
Create a new draft persona.

**Request:**
```json
{
  "name": "string"
}
```

**Response:** `201` with full persona object.

#### `GET /api/personas/:id`
Get full persona details (excluding `hidden_metadata`).

#### `PATCH /api/personas/:id`
Update persona name or trait inputs.

**Request:**
```json
{
  "name": "string (optional)",
  "trait_inputs": { ... }
}
```

#### `DELETE /api/personas/:id`
Soft or hard delete. Cascades to Storage cleanup.

---

### 6.2 Image Analysis

#### `POST /api/analyze`
Upload a face image → Gemini Flash reverse-engineers traits.

**Request:** `multipart/form-data`
- `image`: File (JPEG/PNG, max 10 MB)
- `persona_id`: string (uuid)

**Backend Flow:**
1. Upload image to `source-images` Blob container.
2. Send image to Gemini Flash with a system prompt instructing it to output structured trait JSON matching the `trait_inputs` schema.
3. Save `source_image_url` and `trait_inputs` on the persona record.
4. Return trait data to the frontend to populate UI controls.

**Response:**
```json
{
  "source_image_url": "string",
  "trait_inputs": {
    "age": 24,
    "ethnicity": "mixed_asian_caucasian",
    "gender": "female",
    "hair_color": "dark_brunette",
    "hair_texture": "wavy",
    "eye_color": "hazel",
    "eye_shape": "almond",
    "face_shape": "oval",
    "jawline": "soft_v_shape",
    "skin_tone": "light_olive",
    ...
  }
}
```

---

### 6.3 Live Preview

#### `POST /api/preview`
Generate a quick headshot preview from current trait inputs.

**Request:**
```json
{
  "persona_id": "uuid",
  "trait_inputs": { ... }
}
```

**Backend Flow:**
1. Send `trait_inputs` to Gemini Flash with a system prompt to produce a concise Imagen 3 prompt for a neutral headshot.
2. Send resulting prompt to Imagen 3.
3. Return base64 image data (no storage — previews are ephemeral).

**Response:**
```json
{
  "image_base64": "string",
  "mime_type": "image/png"
}
```

**Performance Target:** < 10 seconds end-to-end.

---

### 6.4 Persona Finalization

#### `POST /api/finalize`
The critical "Save Persona" action. Generates hidden JSON + 9-grid.

**Request:**
```json
{
  "persona_id": "uuid"
}
```

**Backend Flow:**
1. Set persona `status` → `finalizing`.
2. **Generate Hidden JSON:**
   - Send `trait_inputs` (+ `source_image_url` if present) to Gemini Flash with a detailed system prompt instructing it to produce a strict, weighted, tag-based JSON descriptor optimized for image model consistency. The output must conform to the `hidden_metadata` schema (see §8).
   - Save to `personas.hidden_metadata`.
3. **Generate 9-Grid Reference Sheet:**
   - Construct 9 individual Imagen 3 prompts from the hidden JSON, each specifying a different angle/expression/lighting (see layout below).
   - Generate all 9 images (parallelized where API rate limits allow).
   - Composite the 9 images into a single grid image (using `sharp` on the server).
   - Upload the grid to `nine-grids` Blob container.
   - Save URL to `personas.nine_grid_url`.
4. Set persona `status` → `ready` (or `error` on failure).

**9-Grid Prompt Variants:**

| Cell | Description | Key Prompt Modifiers |
|---|---|---|
| 1 | Frontal Neutral | `front-facing, neutral expression, even studio lighting` |
| 2 | Left Profile | `left profile view, 90 degrees, neutral expression` |
| 3 | Right Profile | `right profile view, 90 degrees, neutral expression` |
| 4 | Frontal Smiling | `front-facing, warm genuine smile, studio lighting` |
| 5 | Frontal Expressive | `front-facing, surprised or intense expression` |
| 6 | 3/4 Angle Neutral | `three-quarter angle view, neutral expression` |
| 7 | Looking Up | `front-facing, chin tilted up, eyes looking upward` |
| 8 | Looking Down | `front-facing, chin tilted down, eyes looking downward` |
| 9 | Harsh Lighting | `front-facing, dramatic side lighting, strong shadows` |

**Response:**
```json
{
  "persona_id": "uuid",
  "status": "ready",
  "nine_grid_url": "string"
}
```

**Performance Note:** This is the longest operation (~30–60s for 9 images + compositing). The frontend should show a loading overlay with a spinner. The `/api/finalize` endpoint is a standard synchronous POST — the client waits for the response. Consider a generous timeout (90s) on the client side.

---

### 6.5 Image Generation (Playground)

#### `POST /api/generate`
User sends a natural language scenario prompt; backend merges with persona data and generates.

**Request:**
```json
{
  "persona_id": "uuid",
  "prompt": "Make her drinking a coffee at a Parisian cafe during golden hour."
}
```

**Backend Flow:**
1. Fetch persona record (must be `status = 'ready'`).
2. Create a `generations` row with `status = 'pending'`.
3. **Prompt Merging (Gemini Flash):**
   - System prompt instructs Gemini to combine:
     - The user's scenario prompt
     - The full `hidden_metadata` JSON
     - Instruction to reference the 9-grid for likeness
   - Output: a single optimized master prompt for Imagen 3.
   - Save `merged_prompt` on the generation record.
4. Send master prompt + 9-grid reference image to Imagen 3.
5. Upload result to `generated-images` Blob container.
6. Update generation row: `status = 'completed'`, set `result_url`.

**Response (streamed or final):**
```json
{
  "generation_id": "uuid",
  "status": "completed",
  "result_url": "signed-url",
  "merged_prompt": "string (debug, optional)"
}
```

**Performance Target:** 10–15 seconds.

---

### 6.6 Video Face-Swap (Motion Lab)

#### `POST /api/video/submit`

**Request:** `multipart/form-data`
- `video`: File (MP4, max 100 MB)
- `persona_id`: string (uuid)

**Backend Flow:**
1. Validate persona is `ready`.
2. Upload video to `videos-input` Blob container.
3. Create `generations` row (`type = 'video'`, `status = 'pending'`).
4. Create `video_jobs` row (`status = 'submitted'`).
5. Call Kling AI API:
   - Send: reference image (9-grid or best frontal crop from 9-grid) + input video URL/bytes.
   - Receive: `kling_task_id`.
6. Store `kling_task_id` on the video job.
7. **Start background polling** (see §6.7).

**Response:**
```json
{
  "generation_id": "uuid",
  "video_job_id": "uuid",
  "status": "submitted"
}
```

#### `GET /api/video/status/:job_id`
Fallback polling endpoint (primary delivery is via Realtime).

**Response:**
```json
{
  "video_job_id": "uuid",
  "status": "processing | completed | failed",
  "progress": 45,
  "result_video_url": "signed-url | null"
}
```

---

### 6.7 Video Job Polling Worker

Since Kling AI processing is async (potentially minutes), a background mechanism is needed:

**Approach: Aspire Background Worker (or Azure Container Apps Job)**

- A lightweight polling loop runs inside the Next.js server process (using `setInterval` on startup) or as a separate Azure Container Apps Job scheduled by Aspire.

- Runs every **15 seconds**.
- Queries `video_jobs WHERE status IN ('submitted', 'processing')`.
- For each, polls Kling API with `kling_task_id`.
- Updates `progress`, `status`, and `result_video_url` in the database.
- When a job reaches `completed`:
  - Downloads the result video from Kling.
  - Re-uploads to `videos-output` Blob container (to own the asset).
  - Updates `generations.result_url` and `generations.status`.
- When a job reaches `completed`, the next client poll to `GET /api/video/status/:id` will return the result URL and `completed` status.

---

## 7. Frontend Architecture

### 7.1 Route Structure (App Router)

```
app/
├── layout.tsx              # Root layout, global providers
├── page.tsx                # Landing / redirect to studio
├── studio/
│   ├── page.tsx            # Persona gallery + "New Persona" button
│   └── [id]/
│       └── page.tsx        # Character creation/editing view
├── playground/
│   └── page.tsx            # Image generation chat interface
├── motion-lab/
│   └── page.tsx            # Video face-swap interface
└── api/
    ├── personas/
    │   └── route.ts        # GET (list), POST (create)
    ├── personas/[id]/
    │   └── route.ts        # GET, PATCH, DELETE
    ├── analyze/
    │   └── route.ts
    ├── preview/
    │   └── route.ts
    ├── finalize/
    │   └── route.ts
    ├── generate/
    │   └── route.ts
    └── video/
        ├── submit/
        │   └── route.ts
        └── status/[jobId]/
            └── route.ts
```

### 7.2 Key Components

```
components/
├── personas/
│   ├── PersonaGallery.tsx       # Grid/list of saved personas (sidebar or full page)
│   ├── PersonaCard.tsx          # Thumbnail card (name, 9-grid preview, status badge)
│   ├── TraitEditor.tsx          # The main creation form
│   ├── BasicTraits.tsx          # Age, ethnicity, hair, eyes, gender
│   ├── AdvancedTraits.tsx       # Jawline, cheekbones, canthal tilt, etc.
│   ├── ImageUploader.tsx        # Drag-and-drop face upload for reverse-engineering
│   └── LivePreview.tsx          # Shows preview headshot, "Refresh" button
├── playground/
│   ├── ChatInterface.tsx        # Message list + input box (Google AI Studio style)
│   ├── ChatMessage.tsx          # Single message bubble (text, image, loading)
│   ├── PersonaSelector.tsx      # Sidebar persona picker for active session
│   └── ImageResult.tsx          # Generated image with download button
├── motion-lab/
│   ├── VideoUploader.tsx        # Video file drop zone
│   ├── VideoJobStatus.tsx       # Progress bar, realtime status
│   └── VideoResult.tsx          # Completed video player + download
└── ui/
    └── (shadcn/ui primitives)   # Button, Input, Slider, Select, Sheet, Dialog, etc.
```

### 7.3 Client State Architecture

No external state management library is used. State is handled with built-in React primitives and URL params.

**Active persona (cross-page):**
Tracked via URL search param `?persona=<uuid>`. Each page reads it from the URL. This survives refresh, is bookmarkable, and requires zero library code.

```typescript
// Read active persona from URL in any page
const searchParams = useSearchParams()
const personaId = searchParams.get('persona')
```

**Server data (persona list, persona details):**
Fetched with standard `fetch` in Server Components where possible, or via simple custom hooks in Client Components:

```typescript
// Simple data-fetching hook (no library needed)
function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  useEffect(() => {
    fetch('/api/personas').then(r => r.json()).then(setPersonas)
  }, [])
  return personas
}
```

**Page-local state** (`useState` / `useReducer`):
- `traitInputs`, `previewUrl`, `isPreviewLoading` — scoped to the Studio page
- `chatMessages`, `isGenerating` — scoped to the Playground page
- `videoJobId`, `videoJobStatus` — scoped to the Motion Lab page

### 7.4 Video Job Polling (Client-Side)

The only async operation is Kling video processing (1–5 min). The client polls `GET /api/video/status/:id` on an interval:

```typescript
// Simple polling hook for video job status
function useVideoJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<VideoJobStatus | null>(null)

  useEffect(() => {
    if (!jobId) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/video/status/${jobId}`)
      const data = await res.json()
      setStatus(data)
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(interval)
      }
    }, 5000) // poll every 5 seconds
    return () => clearInterval(interval)
  }, [jobId])

  return status
}
```

All other operations (image analysis, preview, finalization, image generation) are standard synchronous request/response — the client shows a loading spinner and awaits the result.

---

## 8. Hidden Metadata Schema (Full)

This is the complete JSON structure stored in `personas.hidden_metadata`. It is generated by Gemini Flash during finalization and **never exposed to the user**.

```typescript
interface HiddenMetadata {
  // -- Structured Descriptor --
  base_demographics: {
    age: number
    ethnicity: string            // e.g., "mixed_asian_caucasian"
    gender: string               // "female" | "male" | "non_binary"
  }
  facial_structure: {
    face_shape: string           // "oval" | "round" | "square" | "heart" | "oblong"
    jawline: string              // "soft_v_shape" | "angular" | "rounded" | "wide"
    chin: string                 // "slightly_pointed" | "rounded" | "cleft" | "prominent"
    cheekbone_height: string     // "high" | "medium" | "low"
    cheekbone_prominence: string // "prominent" | "subtle" | "flat"
    forehead: string             // "high" | "average" | "low" | "wide" | "narrow"
  }
  eyes: {
    color: string
    shape: string                // "almond" | "round" | "hooded" | "monolid" | "downturned"
    canthal_tilt: string         // "positive" | "neutral" | "negative"
    size: string                 // "large" | "medium" | "small"
    spacing: string              // "wide_set" | "average" | "close_set"
    eyebrows: string             // "thick_arched" | "thin_straight" | "bushy" | "feathered"
    eyelashes: string            // "long_thick" | "average" | "sparse"
  }
  nose: {
    bridge: string               // "straight" | "arched" | "flat" | "bumped"
    tip: string                  // "slightly_upturned" | "downturned" | "rounded" | "pointed"
    width: string                // "narrow" | "average" | "wide"
    nostril_shape: string        // "round" | "flared" | "narrow"
  }
  mouth: {
    lip_fullness: string         // "full" | "thin" | "full_lower_lip" | "full_upper_lip"
    lip_color: string            // "pink" | "dark_pink" | "neutral" | "brown_toned"
    corners: string              // "upturned" | "neutral" | "downturned"
    width: string                // "wide" | "average" | "small"
    philtrum: string             // "defined" | "flat" | "deep"
  }
  skin_hair: {
    hair_color: string
    hair_texture: string         // "straight" | "wavy" | "curly" | "coily"
    hair_length: string          // "short" | "medium" | "long" | "very_long"
    hair_style: string           // free-form, e.g., "side_part_layered"
    skin_tone: string            // "fair" | "light_olive" | "medium" | "tan" | "dark_brown" | "deep"
    skin_texture: string         // "smooth" | "textured" | "pores_visible"
    blemishes: string            // "none" | "freckles_on_nose" | "beauty_mark_left_cheek" etc.
    facial_hair: string          // "none" | "stubble" | "full_beard" | "mustache"
  }

  // -- Model-Optimized Prompt Tag --
  // A pre-built natural language paragraph summarizing all the above,
  // optimized for Imagen 3 prompt injection. Generated by Gemini Flash.
  master_prompt_fragment: string
}
```

---

## 9. AI Prompt Engineering

### 9.1 Gemini Flash — Image Reverse-Engineering

**System Prompt (for `/api/analyze`):**

```
You are an expert facial feature analyst. Given a photograph of a human face,
output a JSON object that precisely describes every visible facial trait.
Use the following schema exactly: { age, ethnicity, gender, hair_color,
hair_texture, hair_length, eye_color, eye_shape, face_shape, jawline, chin,
cheekbone_height, skin_tone, skin_texture, blemishes, nose_bridge, nose_tip,
nose_width, lip_fullness, lip_color, canthal_tilt, eyebrows, forehead }.
Be specific and granular. Use snake_case values. Do not hallucinate features
you cannot clearly see — use "not_visible" for those.
Output only valid JSON, no markdown.
```

### 9.2 Gemini Flash — Hidden JSON Generation

**System Prompt (for `/api/finalize` step 2):**

```
You are a character consistency engine. Given the user's trait selections
(JSON), generate a comprehensive persona descriptor optimized for AI image
generation consistency. The output must follow this exact schema:
[full HiddenMetadata interface].

Additionally, generate a `master_prompt_fragment` field: a single dense
paragraph (150-200 words) that describes this person's exact appearance in
natural language, suitable for direct injection into an image generation
prompt. Use precise, unambiguous descriptors. Include lighting-invariant
features. Prioritize bone structure, proportions, and unique distinguishing
marks.

Output only valid JSON, no markdown.
```

### 9.3 Gemini Flash — Prompt Merging

**System Prompt (for `/api/generate`):**

```
You are a prompt engineer for AI image generation. You will receive:
1. A user's scenario request (natural language).
2. A character's master_prompt_fragment (a precise appearance description).

Your task: Merge these into a single, optimized prompt for Imagen 3.
Rules:
- The character description MUST be preserved exactly. Do not simplify or
  alter facial features.
- Seamlessly integrate the scenario (setting, pose, clothing, mood, lighting)
  around the character description.
- Output a single prompt string (no JSON wrapping). Max 500 tokens.
- Append: "Maintain exact facial likeness from reference images."
```

### 9.4 Imagen 3 — 9-Grid Base Prompt Template

Each of the 9 cells uses this template, with `{variant}` swapped:

```
A photorealistic portrait of [master_prompt_fragment].
{variant description}. Plain background. 8K detail, professional photography.
```

---

## 10. Frontend Behavior Details

### 10.1 Studio — Character Creation Flow

1. User clicks **"New Persona"** → `POST /api/personas` → navigates to `/studio/{id}`.
2. **Option A:** User uploads a face image → hits `/api/analyze` → UI auto-populates.
   **Option B:** User manually fills in Basic Traits.
3. User toggles "Advanced" to fine-tune.
4. User clicks **"Preview"** → hits `/api/preview` → ephemeral headshot shown.
5. User clicks **"Save Persona"** → hits `/api/finalize` → loading overlay with progress.
6. On `status = 'ready'` (via Realtime), show the 9-grid and redirect to gallery or playground.

### 10.2 Playground — Image Generation Flow

1. Left sidebar: **PersonaSelector** lists all `ready` personas. User picks one.
2. Chat input at bottom. User types scenario.
3. On submit → optimistic UI adds user message bubble + loading skeleton.
4. `POST /api/generate` → on completion, image message bubble appears with download button.
5. Conversation is local (React state). Not persisted to DB in MVP (generations table stores results, but full chat history is client-side).

### 10.3 Motion Lab — Video Face-Swap Flow

1. User selects persona from sidebar (same PersonaSelector).
2. User uploads a video file (drag-and-drop zone, accepts MP4, max 100 MB).
3. On upload → `POST /api/video/submit` → UI shows progress card.
4. Realtime subscription pushes `progress` updates → progress bar animates.
5. On `status = 'completed'` → video player loads with download button.
6. On `status = 'failed'` → error message with retry option.

---

## 11. Error Handling Strategy

| Scenario | Handling |
|---|---|
| Gemini API rate limit / 429 | Exponential backoff (3 retries, 1s → 2s → 4s). Surface "Busy, retrying…" to user. |
| Imagen 3 content filter block | Surface friendly message: "This prompt couldn't be processed. Try rephrasing." |
| Kling API timeout | Mark job as `failed` after 10 minutes of no progress. Allow user retry. |
| Partial 9-grid failure (e.g., 7/9 generated) | Retry failed cells up to 2 times. If still failing, proceed with available cells and note degraded quality. |
| File upload too large | Client-side validation + server-side 413 response. |
| Network disconnect during generation | Client stores pending generation ID. On reconnect, check status via `/api/video/status` or Realtime re-subscribe. |

All API routes return consistent error responses:

```json
{
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Human-readable description",
    "details": { ... }
  }
}
```

---

## 12. Environment Variables

```env
# Azure PostgreSQL
DATABASE_URL=postgresql://user:password@yourserver.postgres.database.azure.com:5432/personasync?sslmode=require

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=personasyncblobs

# Google AI (Gemini + Imagen)
GOOGLE_AI_API_KEY=AIza...

# Kling AI
KLING_API_KEY=...
KLING_API_BASE_URL=https://api.klingai.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** When running locally via Aspire, connection strings for PostgreSQL and Blob Storage are injected automatically as environment variables by the AppHost. The `.env` file is only needed for standalone Next.js development without Aspire.

---

## 13. Performance Budgets

| Operation | Target | Hard Limit |
|---|---|---|
| Image analysis (reverse-engineer) | < 5s | 15s timeout |
| Live preview generation | < 8s | 15s timeout |
| Persona finalization (full 9-grid) | < 45s | 90s timeout |
| Image generation (playground) | < 12s | 20s timeout |
| Video face-swap submission | < 3s (submit only) | 10s timeout |
| Video face-swap processing | ~1–5 min (async) | 10 min hard kill |

---

## 14. Security Considerations (MVP)

- **No auth in MVP.** All personas are globally accessible. This is acceptable for a single-user/demo deployment.
- **API keys** are server-side only (never in `NEXT_PUBLIC_` vars). Azure connection strings are injected by Aspire at runtime.
- **File uploads** are validated: MIME type allowlist (`image/jpeg`, `image/png`, `video/mp4`), max size enforced server-side.
- **SAS URLs** for all Blob Storage access (1-hour expiry, regenerated on each request).
- **Rate limiting** on generation endpoints: implement via Next.js middleware. MVP: simple in-memory rate limiter (e.g., 10 generations/minute).
- **Input sanitization:** User prompts passed to Gemini are wrapped in strict system prompts to mitigate prompt injection.

---

## 15. Project Structure (Final)

```
identity-ai/
├── AspireAppHost/                   # .NET Aspire orchestration project
│   ├── AppHost.csproj
│   └── Program.cs                   # Aspire AppHost — wires up all services
├── frontend/                        # Next.js application
│   ├── front-end/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── studio/
│   │   ├── playground/
│   │   ├── motion-lab/
│   │   └── api/
│   ├── components/
│   │   ├── personas/
│   │   ├── playground/
│   │   ├── motion-lab/
│   │   └── ui/
│   ├── lib/
│   │   ├── azure/
│   │   │   ├── db.ts                # Drizzle client (reads DATABASE_URL from env)
│   │   │   └── blob.ts             # Azure Blob Storage helpers (upload, download, SAS URLs)
│   │   ├── ai/
│   │   │   ├── gemini.ts            # Gemini Flash client + prompt templates
│   │   │   ├── imagen.ts            # Imagen 3 generation helper
│   │   │   └── kling.ts             # Kling AI client + job polling
│   │   ├── prompts/
│   │   │   ├── analyze.ts           # System prompts for reverse-engineering
│   │   │   ├── finalize.ts          # System prompts for hidden JSON + 9-grid
│   │   │   ├── merge.ts             # System prompts for prompt merging
│   │   │   └── nine-grid.ts         # 9-grid variant prompt templates
│   │   ├── hooks/
│   │   │   ├── use-personas.ts      # Custom hook for persona data fetching
│   │   │   └── use-video-status.ts  # Polling hook for video job status
│   │   └── utils/
│   │       ├── image-grid.ts        # sharp-based 9-image compositing
│   │       └── errors.ts            # Standardized error responses
│   ├── types/
│   │   ├── persona.ts               # Persona, TraitInputs, HiddenMetadata types
│   │   ├── generation.ts            # Generation, VideoJob types
│   │   └── api.ts                   # API request/response types
│   ├── db/
│   │   ├── schema.ts                # Drizzle schema definitions
│   │   └── migrations/              # Drizzle migration files
│   ├── public/
│   ├── .env.local
│   ├── drizzle.config.ts
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── PRD.md
└── spec.md
```

---

## 16. Aspire AppHost Configuration

The .NET Aspire AppHost (`AspireAppHost/Program.cs`) orchestrates all services:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// Azure PostgreSQL Flexible Server
var db = builder.AddAzurePostgresFlexibleServer("db")
    .AddDatabase("personasync");

// Azure Blob Storage
var blobs = builder.AddAzureStorage("storage")
    .AddBlobs("blobs");

// Next.js frontend (+ API routes)
var frontend = builder.AddJavaScriptApp("frontend", "../front-end")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithReference(db)       // injects DATABASE_URL
    .WithReference(blobs);   // injects AZURE_STORAGE_CONNECTION_STRING

builder.Build().Run();
```

**Local development:** `dotnet run --project AspireAppHost` starts everything — PostgreSQL (via container), Azurite (local Blob Storage emulator), and the Next.js dev server — with connection strings auto-injected.

**Azure deployment:** `aspire publish` generates Azure Container Apps manifests. PostgreSQL Flexible Server and Storage Account are provisioned automatically.

---

## 17. MVP Deployment Checklist

1. **Install .NET Aspire tooling** — `dotnet workload install aspire`.
2. **Run Drizzle migrations** — create tables + indexes + triggers against Azure PostgreSQL.
3. **Create Blob Storage containers** — `source-images`, `nine-grids`, `generated-images`, `videos-input`, `videos-output` (automated via a setup script or first-run init).
4. **Obtain API keys** — Google AI (Gemini/Imagen), Kling AI.
5. **Deploy via Aspire** — `aspire publish` to Azure Container Apps, or run locally with `dotnet run --project AspireAppHost`.
6. **Set external secrets** — Configure `GOOGLE_AI_API_KEY`, `KLING_API_KEY` in Azure Container Apps secrets.
7. **Smoke test** — Create persona → generate image → submit video → verify full loop.

---

## 18. Key Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Imagen 3 doesn't support image-prompting/IP-adapter natively | 9-grid reference can't be used as visual anchor | Fall back to injecting `master_prompt_fragment` text-only; explore Imagen's edit/reference capabilities as they evolve |
| Kling API latency or downtime | Video feature unusable | Graceful degradation: disable Motion Lab with banner; implement webhook support if Kling adds it |
| 9-grid consistency across cells | The 9 images may show slightly different faces | Use Imagen's seed parameter (if available) + inject maximum detail in prompt. Post-MVP: use an img2img or ControlNet approach |
| Gemini prompt injection via user scenario text | Malicious prompts could override persona constraints | Strict system prompt + separate user message role; validate Gemini output against expected schema |
