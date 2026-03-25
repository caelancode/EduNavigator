# EduNavigator — Comprehensive Audit Prompt

> **Instructions:** This document is entirely self-contained. You need nothing else. It includes the original requirements document, the codebase location, orientation, the builder's honest self-assessment, and three complete audit passes to execute. Clone the repo, read the code, and produce the deliverables described at the end.

---

## 1. The Codebase

**GitHub:** https://github.com/caelancode/EduNavigator
**Live app:** https://edu-navigator-eight.vercel.app

Clone it and run:
```bash
git clone https://github.com/caelancode/EduNavigator.git
cd EduNavigator
npm install
npm run typecheck    # tsc --noEmit → 0 errors
npm run lint         # eslint → 0 errors, 7 warnings
npm test             # vitest → 115/115 passing
npm run build        # vite build → ~83KB gzipped
```

---

## 2. Original Requirements Document

The following is the **original tech requirements specification** that this app was built against. The implementation also used a more detailed build spec (`CLAUDE.md` in the repo) — but this document is the source of truth for what was intended.

### §1 System Overview

EduNavigator is a web-based, AI-assisted instructional decision-support tool designed for educators serving students with significant cognitive disabilities. The system supports educators in identifying, understanding, and applying evidence-based instructional strategies through a structured interaction model that combines educator inputs, a constrained AI Chat interface, and a dynamically generated Workspace.

EduNavigator is not an instructional delivery system, student data system, or IEP authoring tool. It does not store student information, retain user sessions, or persist educator edits beyond a single session. All interactions are stateless and ephemeral by design.

Primary users include general educators, special educators, and paraprofessionals seeking instructional strategies aligned to student needs and instructional contexts.

### §2 Core Design Philosophy

The tool is structured around a deliberate separation of roles:
- **Left Rail**: educator navigation, intent-setting
- **Chat**: conversational sense-making with a "sage buddy and advisor"
- **Workspace**: a stable snapshot of evidence-supported instructional strategies
- **Export**: a refined, educator-ready instructional plan

### §3 Tool Scope

Single-page, no-login web application. Educators can:
1. Define instructional context and intent
2. Engage in a conversational exchange with an AI advisor
3. View evidence-grounded instructional strategies
4. Export a concise instructional plan

No user accounts, saved sessions, or personalization over time.

### §4 Left Rail Structure

**Learner Portrait — Core Context (Always Visible)**
- Grade / Age Band
- Instructional Setting
- Instructional Grouping
- Time Available (minutes)

Function: establishes baseline instructional constraints, included in every AI request, strongly constrains retrieval eligibility.

**Learner Characteristics (Collapsed)** — optional, multi-select. "Not Specified" always available. Refines retrieval, maps to document-level tags. Does not trigger clinical or diagnostic guidance.

**Technology Context (Collapsed)** — no tech / minimal tech / specialized tech. Prevents unrealistic recommendations. Used as a negative retrieval constraint.

**Primary Support Area (Required)** — single-select:
- Instructional Support
- Behavior Support
- Communication & AAC
- Functional & Life Skills
- Collaboration & Planning

Central navigational decision. Determines eligible sources, strategy types, and chat framing.

**Sub-Area (Conditional)** — appears after Primary Support Area selection. Finite, predefined options. Secondary retrieval constraint.

**Output Preferences (Collapsed)** — step-by-step, scripts, quick ideas, rationale. Adjusts tone and presentation. Does not affect strategy eligibility.

**Role Perspective (Collapsed)** — general educator, special educator, paraprofessional, related service provider. Adjusts language and assumptions. Supports the "sage buddy" tone.

**Update Guidance Button** — applies Left Rail selections to future responses. Does not clear chat. Does not retroactively alter prior outputs.

### §5 Chat: "Sage Buddy and Advisor"

The chat supports educator thinking and reflection. It behaves like an experienced colleague, a calm coach, a supportive advisor. Encourages inclusive practices.

Characteristics:
- Opening response to guide the conversation based on left rail selections
- Conversational and non-robotic
- May ask clarifying questions
- May explore ideas beyond what appears in the workspace
- Chat log can be copied or exported

**Critical Constraint:** The chat is not authoritative. Only evidence-supported strategies appear in the workspace.

### §6 Workspace: Evidence Snapshot

Provides a trustworthy snapshot of instructional strategies currently supported by evidence. Chat implicitly guides the strategies displayed, while also allowing educators to explicitly request alternatives.

Display: 3 selectable strategy cards for export. Each card includes: strategy title, why this works, concrete "what to do" steps, sources.

Generation: strategies extracted from retrieved, tagged sources. Each includes a direct supporting excerpt and human-readable source reference. Users will be able to rate strategies.

Constraints: no editing or pinning, no accumulation across turns, workspace reflects most recent evidence state only.

### §7 Knowledge Base & Tagging Framework

Source materials: full-text journal articles, summarized articles, technical assistance center resources, instructional websites. Documents uploaded in full, no manual chunking.

Tagging criteria (document-level): disability, age/grade band, instructional setting, content area, functional skills, delivery method, technology requirements, evidence of strength, helpfulness to educators.

Runtime flow: Left Rail context → tag filtering → retrieval → strategy extraction → workspace

### §8 Export

Generate a concise instructional plan based on the workspace. Triggered by "Export My Plan." Inputs: Left Rail context + current workspace strategies. Excluded: chat transcript, full source documents, prior session data. Output: one-page (per strategy) instructional plan with refined language.

### §9 Technical Architecture

Frontend renders Left Rail, chat, workspace, and export views. Contains no AI logic, retrieval logic, or inference. AI orchestration & RAG layer handles system instructions, retrieval constraints, text generation, structured JSON outputs. Minimal application code handles request construction, delimiter detection, JSON validation, failure handling.

**Deterministic Workspace Rendering:** workspace content rendered only from validated JSON. Chat text is never parsed for workspace content. If JSON is missing or invalid, workspace remains empty or shows controlled fallback.

**AI Response Contract:** each response must include (1) educator-facing text, (2) fixed delimiter, (3) JSON array of strategy objects with: title, why_fits, how_to, supporting_excerpt, source_ref. Malformed outputs fail gracefully.

**One API call per educator action.** No background, polling, or UI-triggered calls.

### §10-12 Performance, Cost, Security

- One AI call per chat turn, one per export action
- No background processing or polling
- No PII collection
- No persistent storage
- Sessions are stateless and ephemeral

### §13 Explicit Non-Goals

- User accounts or authentication
- Saved sessions or conversation history
- Persistent personalization or profiles
- Educator-authored or user-uploaded content
- Native mobile applications

### §14 Success Criteria

- Educators understand the Left Rail as navigation (not a form/survey)
- Chat feels supportive and human
- Workspace strategies are clearly evidence-grounded
- Empty states behave correctly

---

## 3. Codebase Orientation

### Architecture (Data Flow)

```
User Input (Left Rail)
    ↓
LeftRailContext (state: grade band, setting, grouping, time, learner characteristics, etc.)
    ↓
"Update Guidance" button OR Chat input
    ↓
sendMessage() in src/services/customgpt.ts
    ↓
fetch POST → /api/chat (Vercel Edge Function at api/chat.ts)
    ↓
Edge Function injects system prompt + educator context → calls Anthropic Messages API (Claude Sonnet 4)
    ↓
Raw text response returned to client
    ↓
parseResponse() in src/services/response-parser.ts
    ↓ 8-step pipeline: empty check → find delimiter → split → JSON.parse → array check → Zod validate → DOMPurify sanitize → return
    ↓
ApiResult: { ok: true, chatText, strategies } | { ok: false, error, chatText? }
    ↓
chatText → ChatContext → Chat panel
strategies → WorkspaceContext → Workspace panel (StrategyCards)
```

### File Structure

```
api/chat.ts                          ← Vercel Edge Function (trust boundary #1)
src/services/
  response-parser.ts                 ← 8-step parsing pipeline (trust boundary #2)
  json-validator.ts                  ← Zod schema for Strategy objects
  request-builder.ts                 ← Builds API request, sanitizes input
  customgpt.ts                       ← API client (legacy name — calls Claude)
  error-handler.ts                   ← Error code → display message mapping
src/contexts/
  LeftRailContext.tsx                 ← Educator input state (useReducer, 11 actions)
  ChatContext.tsx                     ← Chat messages, loading, error, sessionId
  WorkspaceContext.tsx                ← Strategies array, selection set, loading/error
  AppProvider.tsx                     ← Composes all three providers
src/components/
  left-rail/                         ← 13 input components + LeftRail composer
  chat/                              ← ChatPanel, MessageList, ChatMessage, ChatInput, TypingIndicator, ChatCopyButton
  workspace/                         ← WorkspacePanel, StrategyCard + sub-components, Empty/Loading/Error states
  export/                            ← ExportView (print-only), ExportHeader, ExportStrategyPage, ExportButton
  layout/                            ← AppShell, TopBar, ThreePanelLayout (responsive mobile tabs)
  ui/                                ← 8 shared primitives (Button, Dropdown, RadioGroup, MultiSelect, CollapsibleSection, Card, LoadingSpinner, ErrorBanner)
src/types/                           ← TypeScript interfaces
src/constants/left-rail-options.ts   ← All dropdown/radio option arrays
src/__tests__/                       ← 115 tests across 20 files
```

### Known API Pivot

The original spec references "CustomGPT" as the AI backend. During development, CustomGPT required a business email, so the backend was switched to the **Anthropic Claude API** (Messages API, claude-sonnet-4-20250514). The file `src/services/customgpt.ts` retains the legacy name. The Edge Function at `api/chat.ts` calls Anthropic directly and embeds the system prompt. Treat spec references to "CustomGPT" as "the AI backend" generically.

---

## 4. Builder's Honest Self-Assessment

This app was built by a Claude instance in a single session. Here are the known weaknesses. **Dig into these first.**

### Weakest Areas

1. **Duplicated message-sending logic.** `src/components/chat/ChatInput.tsx` and `src/components/left-rail/UpdateGuidanceButton.tsx` contain nearly identical 40-line blocks. Should be a `useSendMessage()` hook. Check both — they could drift apart.

2. **Error display is split and inconsistent.** API failures dispatch to BOTH `ChatContext.state.error` (banner in ChatPanel) AND `WorkspaceContext.error` (banner in WorkspaceError). User sees two different error messages for the same failure.

3. **System prompt is hardcoded in the Edge Function.** `api/chat.ts` contains the entire system prompt as a string literal. Changing it requires redeployment.

4. **No E2E tests.** Spec requires Playwright + axe-core. All 115 tests are unit/component-level via Vitest. No automated cross-browser testing.

5. **LearnerPortrait is misnamed.** Only shows grade band, setting, grouping, time — not learner characteristics. More of a "ContextSummary."

6. **No first-use experience.** No welcome message, no onboarding, no guided walkthrough. Just empty panels with small text hints.

7. **No loading animation on Workspace.** Strategies appear instantly with no transition.

8. **Export is print-only.** `window.print()` only. No `@react-pdf/renderer` fallback.

9. **Chat persona is undefined in UI.** System prompt defines "Sage Buddy and Advisor" but Chat UI shows generic unstyled assistant messages. No name, avatar, or branding.

10. **No edge-level rate limiting.** Spec calls for 30 req/IP/5min. Only client debounce (500ms) exists. `api/chat.ts` has no server-side rate limiter.

### Strongest Areas

- **Response parser** — full 8-step pipeline, 15 adversarial tests, DOMPurify on all fields
- **TypeScript strictness** — `strict: true`, zero `any`, zero `@ts-ignore`
- **Accessibility foundations** — skip link, ARIA landmarks, live regions, keyboard tabs, forced-colors
- **Left Rail** — all 13 components, correct state flow, conditional SubArea, minimum selections gate
- **Security** — API key server-side only, CSP headers, DOMPurify, input sanitization, path validation

---

## PASS 1: Engineering Audit (Senior Engineer Lens)

### 1.1 Specification Compliance Matrix

Audit the implementation against BOTH the original requirements (Section 2 above) AND the detailed build spec (`CLAUDE.md` in the repo). For every requirement, produce:

| Source | Requirement | Status | Notes |
|---|---|---|---|
| §4 Left Rail | Learner Portrait always visible | ? | |
| §5 Chat | Opening response guides conversation | ? | |
| §6 Workspace | 3 selectable strategy cards | ? | |
| §9 Architecture | Deterministic workspace rendering | ? | |
| ... | ... | ... | ... |

Status: `✅ Implemented` | `⚠️ Partially` | `❌ Missing` | `↔️ Deviated`

**Pay special attention to:**
- Left Rail structure (§4) — does the implementation match the specified sections, collapse behavior, and support area options?
- Chat persona (§5) — "opening response to guide the user conversation based on left rail selections" — is this implemented?
- Workspace constraints (§6) — "no editing or pinning, no accumulation across turns" — verify
- AI Response Contract (§9/§11 in original, §7 in CLAUDE.md) — line-by-line
- Success criteria (§14) — evaluate each one honestly
- Security checklist in CLAUDE.md §10 — every bullet point
- Accessibility requirements in CLAUDE.md §11 — every landmark, live region, keyboard interaction

### 1.2 Code Quality Review

Review these critical files for senior-level TypeScript quality:
- `src/services/response-parser.ts` — 8-step pipeline clarity
- `api/chat.ts` — Edge Function security, system prompt structure
- `src/contexts/WorkspaceContext.tsx` — re-render concerns from context value changes
- `src/components/chat/ChatInput.tsx` vs `src/components/left-rail/UpdateGuidanceButton.tsx` — spot the duplication

Look for: `any` types, `@ts-ignore`, unhandled async, React hook dep issues, unnecessary re-renders.

### 1.3 Security Deep Dive

- `npm run build && grep -r "ANTHROPIC\|API_KEY\|sk-ant" dist/` — must be zero matches
- `api/chat.ts` `isValidRequest()` — is validation sufficient?
- `vercel.json` CSP — is `style-src 'unsafe-inline'` necessary?
- `sessionId` — generated client-side via `crypto.randomUUID()`, sent to API. Validated?

### 1.4 Response Parser Resilience

Run test suite. Then test these scenarios that may NOT be covered:
- Claude returns 2 strategies (legitimate — not always 3)
- Extra whitespace around delimiter
- `how_to` at 4,999 chars (just under Zod max)
- JSON array with 10 items (should parser cap it?)
- Markdown in title field
- No delimiter at all (tested, but verify UX fallback)

### 1.5 Test Coverage Gaps

Map every source file to its test file. Flag untested components. Note: **no E2E tests exist** despite spec requiring Playwright + axe-core.

---

## PASS 2: Educator Experience Audit (UX + Simulated User Testing)

### 2.1 Simulated User Testing — Five Personas

For each persona, simulate the full task: open app → configure Left Rail → get strategies → review → export. Document first impression, friction points, trust level, likelihood of return.

**Persona 1: Maya** — first-year SpEd teacher, 24, overwhelmed, low tech confidence, needs strategies for tomorrow
**Persona 2: Tom** — veteran gen ed teacher (25 yrs), skeptical of AI, moderate tech, first time with a student with significant cognitive disabilities
**Persona 3: Dr. Reyes** — SLP, doctoral level, will check citations immediately, high tech fluency, judges credibility by source quality
**Persona 4: James** — paraprofessional, told by supervisor to try it, low tech confidence, needs plain language
**Persona 5: Principal Okafor** — administrator, 3 minutes to form opinion, evaluating for 40-person staff

### 2.2 Nielsen's 10 Heuristics

Apply to each surface (Left Rail, Chat, Workspace, Export). Rate violations 0–4.

### 2.3 User-Facing Text Audit

Every button label, placeholder, heading, error message, empty state, loading message. Is it plain language? Would a paraprofessional understand it instantly?

### 2.4 Chat Persona Audit

Is there a persona name, avatar, or branding? Does the persona introduce itself? Is the tone "warm, experienced colleague"?

### 2.5 First-Use Experience

Open the app cold. How many seconds to understand what it does? Is the relationship between Left Rail, Chat, and Workspace obvious?

### 2.6 Citation Integrity

Is `source_ref` prominently displayed? Can a card render without a citation? What if Claude fabricates a citation? Should there be a disclaimer?

---

## PASS 3: Visual Design & Polish Audit (Design Critic Lens)

Benchmark: **Khanmigo by Khan Academy**.

### 3.1 Visual Design Assessment

Color palette (warm vs. clinical?), typography hierarchy, spacing/density, iconography (almost none currently), visual warmth (teacher tool vs. admin panel?).

### 3.2 Interaction Design

Loading states, strategy card transitions, mobile tab switching, selection feedback, error recovery UX, chat scroll behavior.

### 3.3 Khanmigo Benchmark

Rate each: `Exceeds` | `Matches` | `Below` | `Significantly Below`

| Dimension | Rating | Notes |
|---|---|---|
| Visual warmth | | |
| First-visit clarity | | |
| Typography quality | | |
| Loading states | | |
| Error states | | |
| Chat UI design | | |
| Trust signals | | |
| Mobile responsiveness | | |
| Interaction polish | | |
| Overall professional quality | | |

### 3.4 Gemini Prompt Package

Write **three ready-to-paste Gemini 2.5 Pro prompts** for visual review with screenshots:

1. **Visual Design Review** — evaluate against Khanmigo, produce Tailwind CSS recommendations
2. **Component Redesign** — redesign Chat bubbles, StrategyCard, Left Rail, empty states, TopBar
3. **Trust & Warmth Audit** — persona branding, welcome experience, citation display, color warmth, illustrations

---

## Deliverables

Save all outputs in `docs/audit/`:

### `docs/audit/compliance-matrix.md`
Every requirement from both the original spec (Section 2) and `CLAUDE.md` mapped to implementation status.

### `docs/audit/issues-register.md`
| ID | Severity | Category | Description | Component | Fix |
|---|---|---|---|---|---|
Severity: Critical/High/Medium/Low/Cosmetic. Category: Engineering/UX/Design/Security/Accessibility. Sorted by severity.

### `docs/audit/improvement-plan.md`
Four sprints:
- **Sprint 1 (Critical):** Fix before any educator uses this
- **Sprint 2 (High):** Significantly degrades experience
- **Sprint 3 (Medium):** Quality of life
- **Sprint 4 (Low):** Polish and nice-to-haves

Effort: S (<1hr), M (1-4hr), L (4-8hr), XL (>8hr).

### `docs/audit/gemini-prompts.md`
Three Gemini prompts from Pass 3.4, ready to paste.

### `docs/audit/recommendations-beyond-spec.md`
What should we add beyond the original spec? Trust mechanisms, onboarding, feedback, analytics (no PII), system prompt improvements, accessibility beyond AA, error recovery patterns, anything a senior product team would flag.

---

## Final Notes

- **Be harsh.** Every missed issue is a confused educator.
- **Contradictions between passes are valuable.**
- **Prioritize educator impact** over engineering elegance.
- **The response parser is the strongest module.** If you find issues there, they're significant.
- **The first-use experience is the weakest area.** The builder knows it.
- **Check whether the 115 tests test meaningful behavior**, not just "renders without crashing."
