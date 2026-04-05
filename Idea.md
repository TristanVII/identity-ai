# Idea Backlog

Use this file to capture product and engineering ideas for future implementation.

## Status Legend
- `NEW`: Captured, not reviewed yet.
- `PLANNED`: Approved for future work.
- `LATER`: Valuable, but intentionally postponed.
- `DONE`: Implemented.
- `DROPPED`: Rejected or no longer relevant.

## Priority Legend
- `P0`: Critical
- `P1`: High
- `P2`: Medium
- `P3`: Low

## Idea List
| ID | Title | Status | Priority | Owner | Target Phase |
|---|---|---|---|---|---|
| IDEA-001 | Create Post: select persona + scene, generate post image, auto-publish to Instagram/X with generated caption, description, and @mentions | NEW | P1 | - | Phase 2 |
| IDEA-002 | Scene Library: reusable scene presets for lighting, camera, and mood | NEW | P1 | - | Phase 2 |
| IDEA-003 | Outfit Locker: reusable wardrobe presets per persona for visual consistency | NEW | P2 | - | Phase 2 |
| IDEA-004 | Content Version History: track all generation settings and outputs for reproducibility | NEW | P1 | - | Phase 2 |
| IDEA-005 | Approval Workflow: Draft -> Review -> Approve -> Publish flow for safer social posting | NEW | P0 | - | Phase 2 |
| IDEA-006 | Scheduling + Content Calendar: queue and auto-publish posts by date/time and timezone | NEW | P0 | - | Phase 2 |

---

## Detailed Ideas
### IDEA-001: Create Post Autopilot
- Status: NEW
- Priority: P1
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Users must manually move generated content from our app to social platforms, which slows publishing and breaks workflow momentum.
- Idea:
	Add a `Create Post` flow where the user selects a persona and scene, generates the post image, and publishes directly to Instagram/X from inside the app.
	The app also generates caption text, post description, hashtags, and @mentions that users can review before publishing.
- Scope:
	In scope: Persona selection, scene selection, image generation, social account connection, caption/description/@mention generation, publish-to-Instagram/X action, publish status tracking.
	Out of scope: Multi-platform scheduling calendar, analytics dashboard, auto-reply comments, video publishing automation.
- Success Metric:
	1. At least 40% of generated images are published via the in-app flow.
	2. Median time from generation to published post is under 2 minutes.
	3. At least 80% of users keep AI-generated caption text with minor or no edits.
- Dependencies:
	Instagram Graph API access and app approval, X API access tier, secure OAuth token storage, content moderation checks, retry queue for failed publish jobs.
- Notes:
	Add a publish mode setting: `Review First` (default) vs `Auto Publish`.

### IDEA-002: Scene Library
- Status: NEW
- Priority: P1
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Users repeat similar prompt instructions to recreate locations, lighting, and framing, which causes inconsistency and slower creation.
- Idea:
	Provide reusable scene presets with location style, lighting, camera angle, and mood settings that can be applied in one click during generation.
- Scope:
	In scope: Scene preset catalog, select/favorite preset, basic scene customization (lighting, mood, camera distance), merge with persona constraints during generation.
	Out of scope: Fully custom 3D environment editor, dynamic weather simulation, auto scene generation from external trend feeds.
- Success Metric:
	1. At least 60% of image generations use a saved scene preset.
	2. Average prompt writing time decreases by at least 30%.
	3. Users report higher visual consistency across posts in feedback surveys.
- Dependencies:
	Preset storage model, prompt orchestration updates, scene thumbnail generation, UI for preset management.
- Notes:
	Launch with 20-30 curated presets across lifestyle, studio, travel, and fitness themes.

### IDEA-003: Outfit Locker
- Status: NEW
- Priority: P2
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Generated outfits can drift between posts, making persona branding feel inconsistent.
- Idea:
	Add an outfit preset locker per persona so users can save, reuse, and quickly apply wardrobe combinations and accessory sets.
- Scope:
	In scope: Outfit preset save/apply, style tags, color palette tags, default outfit per persona.
	Out of scope: Full garment marketplace, physics-accurate cloth simulation, automatic brand product ingestion.
- Success Metric:
	1. At least 40% of recurring personas use at least one saved outfit preset.
	2. Reduction in regeneration attempts caused by styling mismatch.
	3. Improved brand consistency score in internal QA reviews.
- Dependencies:
	Outfit metadata schema, prompt merge logic for clothing constraints, preset management UI.
- Notes:
	Support a quick randomize option constrained to the selected style family.

### IDEA-004: Content Version History
- Status: NEW
- Priority: P1
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Teams cannot reliably reproduce successful posts when prompt/config changes are not tracked.
- Idea:
	Create immutable version history for each generated post, storing persona version, scene, outfit, prompt inputs, merged prompt, model settings, and outputs.
- Scope:
	In scope: Automatic version snapshot per generation, version list view, one-click regenerate from prior version, basic compare metadata.
	Out of scope: Full git-like branching/merging UX, cross-workspace version federation, advanced analytics attribution.
- Success Metric:
	1. At least 90% of published posts have complete reproducible metadata.
	2. Faster debugging time for quality regressions.
	3. Reduced duplicate experimentation on already-tested setup combinations.
- Dependencies:
	Versioned data model, storage for prompt/model snapshots, audit logging, regenerate pipeline integration.
- Notes:
	Store external publish response IDs so social posting outcomes can be traced per version.

### IDEA-005: Approval Workflow
- Status: NEW
- Priority: P0
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Teams and agencies need a control step before publishing so accidental, low-quality, or unsafe content does not go live.
- Idea:
	Introduce a workflow state machine: Draft -> In Review -> Approved -> Published (with Rejected and Needs Changes outcomes).
	Creators submit drafts, reviewers approve or request changes, and only approved posts can be published.
- Scope:
	In scope: Post status states, reviewer assignment, approve/reject actions, comments on drafts, audit trail of decisions, integration with publish action.
	Out of scope: Advanced legal approval chains, external client portal, multi-level enterprise governance rules.
- Success Metric:
	1. At least 95% of published posts pass through approval states when team mode is enabled.
	2. Reduction in post deletions or emergency takedowns after publishing.
	3. Faster review turnaround time compared to manual messaging workflows.
- Dependencies:
	Role-based permissions, notification system, post status data model updates, moderation and safety checks before approval.
- Notes:
	Include a workspace setting to choose between `Solo Mode` (no approval required) and `Team Mode` (approval required).

### IDEA-006: Scheduling + Content Calendar
- Status: NEW
- Priority: P0
- Owner: [Name]
- Target Phase: Phase 2
- Problem:
	Users need planned, consistent posting across days and timezones, but current flow is real-time only.
- Idea:
	Add a calendar and scheduler where users can assign a publish date/time to generated posts and auto-publish them later to connected social accounts.
- Scope:
	In scope: Daily/weekly/monthly calendar views, schedule publish time, timezone support, queued publish jobs, edit/cancel scheduled posts, publish result logs.
	Out of scope: Full campaign analytics suite, AI auto-scheduling optimization, cross-tool calendar sync (Google/Outlook) for MVP.
- Success Metric:
	1. At least 50% of created posts are scheduled instead of immediate publish.
	2. On-time publish success rate above 99% for scheduled jobs.
	3. Increased posting consistency (posts per week per active user).
- Dependencies:
	Reliable background job queue, retry and dead-letter handling, social API token refresh management, timezone-aware date handling, notification events.
- Notes:
	Support conflict prevention so two posts are not accidentally scheduled for the same persona/platform/time slot.

## Idea Template
### IDEA-XXX: [Short Title]
- Status: NEW | PLANNED | LATER | DONE | DROPPED
- Priority: P0 | P1 | P2 | P3
- Owner: [Name]
- Target Phase: [MVP / Phase 2 / Phase 3 / TBD]
- Problem:
	[What pain point does this solve?]
- Idea:
	[What is the proposed solution?]
- Scope:
	[What is included and excluded?]
- Success Metric:
	[How do we measure success?]
- Dependencies:
	[APIs, data, infra, team dependencies]
- Notes:
	[Anything important to remember]
