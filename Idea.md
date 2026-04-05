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
