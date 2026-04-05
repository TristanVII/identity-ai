Here is a comprehensive Product Requirements Document (PRD) based on your specifications. You can hand this document directly to your UI/UX designers and development team to start building. 

---

# Product Requirements Document (PRD): PersonaSync Studio (Placeholder Name)

## 1. Executive Summary
**Product Overview:** A web-based application designed to solve the "consistency problem" in AI image and video generation. The platform allows users to create, save, and manage highly detailed AI personas (characters). By generating a precise, hidden JSON metadata file and a 9-grid reference image set for each persona, the app guarantees that subsequent image and video generations feature the exact same face, structure, and characteristics. 
**Objective:** Provide a centralized hub for AI influencers and marketing agencies to manage their "virtual models" and rapidly deploy them across new images (product shoots, lifestyle) and videos (TikTok trends, reels).

## 2. Target Audience & Value Proposition
*   **Primary Audience:** AI Influencers (managing multiple virtual persona accounts) and Marketing Agencies.
*   **Core Value Proposition:** **Unmatched Consistency and Workflow Speed.** Users no longer need to struggle with complex prompting to maintain a character's likeness. By saving a character once, users can seamlessly place that identical character into any text-prompted image scenario or face-swap them onto any uploaded video reference (e.g., a viral TikTok dance).

## 3. Technical Architecture & AI Stack
*   **Orchestration / Text LLM:** Gemini Flash (Latest version) – Used to interpret user chat prompts, reverse-engineer images, and merge user prompts with the hidden JSON metadata.
*   **Image Generation Engine:** Google Imagen 3 (via Gemini API) – Used for live previews, generating the 9-grid reference, and final image generation.
*   **Video / Face-Swap Engine:** Kling AI (Note: via Kling's API or aggregator) – Used to take an uploaded reference video and map the AI persona's face onto the subject seamlessly.

---

## 4. Key User Flows & Functional Requirements

### Phase 1: Character Creation (The "Studio")
This is where the user defines their virtual model. 

*   **Feature 1.1: Image Reverse-Engineering**
    *   Users can upload a reference image of a face.
    *   **Action:** Gemini Flash analyzes the image and auto-populates the Granular UI controls (Feature 1.2). The original image is also saved as a visual anchor.
*   **Feature 1.2: Granular UI Controls**
    *   Users can build a character from scratch or tweak the reverse-engineered traits.
    *   **Basic UI:** Simple inputs (Age, Ethnicity, Hair Color, Eye Color, Gender).
    *   **Advanced UI (Toggleable):** Extreme granular detail (e.g., jawline angularity, cheekbone height, canthal tilt of eyes, skin texture, asymmetrical blemishes, nose bridge width).
*   **Feature 1.3: Live Previewing**
    *   As the user updates traits, they can request a preview. Gemini Flash formats a prompt sent to Imagen 3 to show a quick headshot of the character based on current settings.
*   **Feature 1.4: Character Finalization (The Magic Step)**
    *   When the user clicks "Save Persona," the backend performs two vital tasks:
        1.  **Generates the Hidden JSON:** A strict, highly detailed JSON file is saved to the database. *This is never shown to the user.* It contains exact tags, weights, and descriptions to force the image model to lock in the likeness.
        2.  **Generates the 9-Grid Visual Reference:** The system automatically generates a 9-grid image sheet to be stored as an Image Prompt (IP) reference for future generations. 

> **Suggested 9-Grid Layout:**
> 1. Frontal Neutral | 2. Left Profile | 3. Right Profile
> 4. Frontal Smiling | 5. Frontal Expressive (Surprised/Fierce) | 6. 3/4 Angle Neutral
> 7. Looking Up | 8. Looking Down | 9. Harsh Lighting (to show facial geometry shadow)

### Phase 2: Image Generation (The "Playground")
This is where the user puts their saved characters into different scenarios.

*   **Feature 2.1: Persona Selection**
    *   User selects one of their saved personas from a portfolio/gallery sidebar.
*   **Feature 2.2: Chat Interface (Google AI Studio style)**
    *   The user interacts with a chat box. (e.g., *"Make her drinking a coffee at a Parisian cafe during golden hour."*)
*   **Feature 2.3: Prompt Merging (Backend Orchestration)**
    *   Gemini Flash intercepts the chat request.
    *   It retrieves the **Hidden JSON** and the **9-Grid Image Reference**.
    *   It merges the user's scenario request with the strict facial constraints from the JSON into a highly optimized master prompt.
    *   The master prompt and reference images are sent to Imagen 3.
*   **Feature 2.4: Output & Download**
    *   The user is presented with the generated image(s) in the chat feed.
    *   The only post-generation action available is a "Download" button.

### Phase 3: Video Face-Swap Integration (The "Motion Lab")
This is where users adapt their characters to viral video trends.

*   **Feature 3.1: Video Upload**
    *   User selects their saved persona.
    *   User uploads a reference video (e.g., an MP4 of a person doing a TikTok dance).
*   **Feature 3.2: Kling Video Generation**
    *   The system sends the uploaded video + the persona's 9-Grid Reference Image to the Kling AI Face-Swap/Video generation API.
*   **Feature 3.3: Output & Download**
    *   The processed video is returned to the chat/dashboard, showing the AI Persona performing the exact actions from the reference video.
    *   User can download the result.

---

## 5. System Architecture / Data Models

**Persona Object:**
*   `persona_id` (String)
*   `persona_name` (String)
*   `source_image_url` (String - optional)
*   `9_grid_reference_url` (String)
*   `hidden_metadata` (JSON - see below)

**Example Hidden JSON Structure (For Developer Reference):**
```json
{
  "base_demographics": {"age": 24, "ethnicity": "mixed_asian_caucasian", "gender": "female"},
  "facial_structure": {"face_shape": "oval", "jawline": "soft_v_shape", "chin": "slightly_pointed"},
  "eyes": {"color": "hazel", "shape": "almond", "canthal_tilt": "positive", "eyebrows": "thick_arched"},
  "nose": {"bridge": "straight", "tip": "slightly_upturned", "width": "narrow"},
  "mouth": {"lips": "full_lower_lip", "corners": "neutral"},
  "skin_hair": {"hair_color": "dark_brunette", "hair_texture": "wavy", "skin_tone": "light_olive", "blemishes": "freckles_on_nose"}
}
```

---

## 6. Non-Functional Requirements (UX & Performance)
*   **Ease of Use:** The complexity of prompting is entirely hidden from the user. They simply click a character and type naturally.
*   **Performance:** Image generation should return within 10-15 seconds. Video generation will be asynchronous (user sees a loading state or gets notified when the Kling API finishes processing).
*   **Responsive UI:** Web app must work seamlessly on Desktop. Mobile responsiveness is secondary but recommended for the chat interface.

## 7. Out of Scope for MVP (Phase 2 Roadmap)
The following are explicitly *excluded* from the current build to focus on core functionality:
*   User account login, billing, and credit limits.
*   Advanced post-generation edits (Inpainting, upscaling, removing backgrounds).
*   Multi-character generation in a single image (e.g., two saved personas hugging).
*   Audio/Voice generation.
*   Allow to create and save custome sceneries


---

### Next Steps for You:
1.  **Review the Flow:** Does the transition from Character Creation -> Chat interface -> Video Upload match your vision?
2.  **UI/UX Design:** Have a designer create wireframes for: 
    *   The Character Studio (with the basic/advanced toggles).
    *   The Chat Playground / Video Upload interface.
3.  **API Keys:** Procure API access to Google Cloud (for Gemini/Imagen) and Kling AI to begin backend prototyping.
