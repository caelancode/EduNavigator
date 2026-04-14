# EduNavigator — Project Navigator

> **Purpose:** Persistent context file for Claude Code. This document is the single source of truth for building EduNavigator. Claude should need nothing beyond this file and the current project directory to guide the build.

---

## 1. Project Summary

EduNavigator is a stateless single-page application that helps educators find evidence-based instructional strategies for students with significant cognitive disabilities. It connects to the Claude API backend via a single API call per interaction and presents results across four surfaces:

- **Left Rail** — Structured input panel. Educators select grade band, setting, grouping, time, learner characteristics, technology context, support area/sub-area, output preferences, and role perspective. All inputs are constrained to predefined enums (dropdowns, radios, multi-selects). No free text except Chat.
- **Chat** — Conversational interface. Displays the AI's educator-facing prose response. Supports multi-turn conversation within a session. Messages are not persisted across page loads.
- **Workspace** — Deterministic strategy display. Shows 0–3 strategy cards parsed from the structured JSON portion of the API response. Each card contains: title, why_fits, how_to, supporting_excerpt, source_ref. The Workspace never displays raw AI text — only validated, schema-conforming objects.
- **Export** — Generates a print-ready / PDF document combining the current Left Rail context header with selected strategy cards. No chat transcript. No PII.

### Critical Architectural Constraints

1. **Stateless.** No database, no user accounts, no server-side session storage. Every page load is a fresh start. Session state lives only in React context and is discarded on navigation/refresh.
2. **Single API call.** Each "Update Guidance" click or chat message triggers exactly one API call to the Claude API backend. The response contains both conversational text and structured strategy JSON, separated by a delimiter.
3. **Deterministic Workspace.** The Workspace is a pure function of the parsed API response. If the parser extracts 3 valid strategies, the Workspace shows 3 cards. If 0, it shows an empty state. No interpolation, no client-side generation.
4. **No PII.** The application collects no personally identifiable information. No analytics beyond Vercel's built-in (anonymous). No cookies beyond technical necessity. Sentry payloads are sanitized.

---

## 2. Tech Stack (Settled Decisions)

These are final. Do not suggest alternatives.

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 | No SSR. No Next.js. SPA only. |
| Build tool | Vite 5.x | Sub-second HMR, native TS support |
| Language | TypeScript 5.x (strict mode) | `strict: true` in tsconfig. No `any`. No `@ts-ignore`. |
| Styling | Tailwind CSS 3 + `@tailwindcss/typography` | Utility-first. Design tokens via Tailwind config extension. |
| State management | React Context + `useReducer` | Four contexts: LeftRailContext, ChatContext, WorkspaceContext, CrossReferenceContext. No Redux/Zustand. |
| Runtime validation | Zod | All API response validation. Bridge between TS compile-time and runtime. |
| Sanitization | DOMPurify | All inbound API text/strategy fields. |
| Testing — Unit/Integration | Vitest | Jest-compatible API, native Vite integration |
| Testing — Component | React Testing Library | Behavior-focused, accessibility-first |
| Testing — E2E | Playwright | Cross-browser, integrated axe-core |
| Linting | ESLint 9.x + accessibility rules | Zero errors policy |
| Formatting | Prettier 3.x | Enforced via pre-commit hook |
| Pre-commit | Husky + lint-staged | Runs lint + typecheck before commit |
| Deployment | Vercel (free tier) | Static SPA + single Edge Function |
| Error tracking | Sentry (free tier) | Source maps uploaded on deploy. Sanitized payloads. |
| PDF export | `@react-pdf/renderer` (fallback) | Primary path: `window.print()` + CSS print stylesheet |

---

## 3. Operational Instructions for Claude

Follow these rules in every session. They are non-negotiable.

### Navigation

- **When the user says "next step":** Scan the project directory (`tree src/`), compare against the phase checklist above, identify the first incomplete deliverable, and recommend it. State which phase you are in and what will be built.
- **When starting a new phase:** State the phase number, objectives, and full deliverable list before writing any code. Confirm with the user before proceeding.
- **At phase boundaries:** Evaluate every exit criterion. List each criterion with ✅ or ❌. Do not proceed to the next phase until all criteria are met or the user explicitly overrides.

### Code Quality

- **Interfaces first.** Before writing any implementation code, confirm the relevant TypeScript interfaces exist in `src/types/`. If they don't, generate them first.
- **Never use `any` types.** Use `unknown` with type guards if the type is genuinely unknown.
- **Never use `@ts-ignore` or `@ts-expect-error`.**
- **Never skip error handling.** Every async operation has a try/catch. Every API call returns a discriminated union result, not a thrown exception.
- **No floating dependency versions.** Use exact versions in `package.json`.

### Testing

- **After completing each component, generate its test file.** Place tests in `src/__tests__/` mirroring the source structure.
- **Unit tests for every pure function.** Priority: response parser, request builder, JSON validator, reducers.
- **Component tests use React Testing Library.** Test behavior (user events, rendered output, accessibility attributes), not implementation.
- **Adversarial parser tests are mandatory** before the response parser is considered complete.

### File Conventions

- **One component per file.** File name matches component name: `StrategyCard.tsx` exports `StrategyCard`.
- **Barrel exports via index.ts** in each component directory.
- **Constants and enums** go in `src/constants/`, not inline.
- **Hooks** go in `src/hooks/`.
- **Commit message format:** `[Phase][Module] Brief description` — e.g., `[P1][LeftRail] Add GradeBandSelect with unit tests`.

### Context Management

- If a session is getting long, produce a handoff document before ending. Include: files created/modified, interfaces implemented, test status, outstanding TODOs, known issues, integration notes.

---

## 4. Claude API Integration Spec

This is the most architecturally critical module. The response parser is the trust boundary between unpredictable AI output and the deterministic Workspace.

### System Prompt (Draft)

```
You are EduNavigator's Sage Buddy and Advisor — a warm, experienced
colleague who helps educators find evidence-based strategies for
students with significant cognitive disabilities.

PERSONA:
- Speak as a supportive, knowledgeable colleague
- Be conversational, never robotic or clinical
- Ask clarifying questions when helpful
- Encourage inclusive practices
- Never claim authority — evidence speaks for itself

RESPONSE FORMAT (MANDATORY):
Every response MUST contain exactly three parts:
1. Educator-facing conversational text
2. The delimiter: ===STRATEGIES_JSON===
3. A valid JSON array of exactly 3 strategy objects

JSON SCHEMA (each object):
{
  "title": "Concise strategy name",
  "why_fits": "Why this strategy fits the current context",
  "how_to": "Step-by-step implementation instructions",
  "supporting_excerpt": "Direct quote from source document",
  "source_ref": "Author (Year). Title. Publication."
}

CONTEXT USAGE:
The educator has provided the following context:
- Grade/Age Band: {grade_band}
- Setting: {setting}
- Grouping: {grouping}
- Time: {time_minutes} minutes
- Learner characteristics: {characteristics}
- Technology: {tech_context}
- Support area: {support_area}
- Sub-area: {sub_area}
- Output preference: {output_pref}
- Role: {role}

Use these to constrain your retrieval and tailor your response.
Never recommend strategies requiring technology the educator
indicated is unavailable. Always match the age/grade band.

CONSTRAINTS:
- Only recommend strategies supported by uploaded source documents
- Each supporting_excerpt must be a real excerpt from a document
- Each source_ref must reference an actual uploaded document
- Never fabricate sources or excerpts
- If fewer than 3 strategies are available, return what you have
  but always return the JSON array (even if empty: [])
```

### Delimiter Contract

The delimiter string is: `===STRATEGIES_JSON===`

- Appears exactly once per response.
- Everything before it is Chat text (rendered in the Chat panel).
- Everything after it is a JSON array of Strategy objects (parsed for the Workspace).
- If the delimiter is missing, the entire response is treated as Chat text and the Workspace shows a fallback state.

### Response Parsing Pipeline

The parser (`src/services/response-parser.ts`) executes these steps in strict order:

1. **Receive** raw response string from API.
2. **Find delimiter** — `indexOf('===STRATEGIES_JSON===')`. If not found → return chat text = full response, strategies = [], error = `missing_delimiter`.
3. **Split** — `chatText = response.substring(0, delimiterIndex).trim()`, `jsonPayload = response.substring(delimiterIndex + delimiter.length).trim()`.
4. **JSON.parse** — If throws → return chatText, strategies = [], error = `invalid_json`.
5. **Array check** — `Array.isArray(parsed)`. If false → error = `not_array`.
6. **Schema validation** — Run each element through Zod `StrategySchema`. Filter out invalid objects. If zero remain → error = `no_valid_strategies`.
7. **Sanitize** — Run DOMPurify on every string field in every valid Strategy object.
8. **Return** typed `ApiResult`.

### Zod Schema

```typescript
import { z } from 'zod';

export const StrategySchema = z.object({
  title: z.string().min(1).max(200),
  why_fits: z.string().min(1).max(2000),
  how_to: z.string().min(1).max(5000),
  supporting_excerpt: z.string().min(1).max(2000),
  source_ref: z.string().min(1).max(500),
});

export type StrategyFromSchema = z.infer<typeof StrategySchema>;
```

### Error Taxonomy

| Code | Condition | Chat Panel | Workspace |
|---|---|---|---|
| `network_error` | Fetch fails (timeout, DNS, CORS) | "Connection issue" + retry button | Unchanged |
| `timeout` | Response >30s | "Taking longer than expected" + retry | Unchanged |
| `missing_delimiter` | Delimiter not found | Show full response as chat text | "Strategies unavailable" banner |
| `invalid_json` | JSON.parse throws | Show chat text normally | Fallback state |
| `not_array` | Parsed JSON is not an array | Show chat text | Fallback state |
| `schema_violation` | Objects fail Zod | Show chat text | Only valid strategies shown |
| `no_valid_strategies` | Empty array or all invalid | Show chat text | "No matching strategies found" |
| `empty_response` | Response body is empty | "No response received" + retry | Unchanged |
| `rate_limited` | HTTP 429 | "Please wait" + countdown | Unchanged |

### Adversarial Parser Test Cases

These are mandatory. The parser is not complete until all pass:

1. Truncated response (cuts off mid-JSON)
2. Missing delimiter entirely
3. Double delimiter (split on first occurrence)
4. Valid JSON embedded in pre-delimiter chat text (must be ignored)
5. Valid JSON array but missing required fields on objects
6. Objects with unexpected extra properties (strip and retain valid)
7. 50KB+ response (must parse within 50ms, no UI freeze)
8. Empty JSON array `[]`
9. Null values in required string fields
10. HTML/script injection in strategy fields (DOMPurify must strip)
11. Unicode edge cases (emoji, RTL text, special characters)

---

## 5. Quality Gates

These are checkpoints where the human operator **must** review before work continues. Claude should pause and explicitly prompt for human review at each gate.

| Gate | When | What to Review |
|---|---|---|
| **Interfaces** | End of Phase 0 | All files in `src/types/`. Confirm field names, types, and enum values match the API contract and Left Rail options. |
| **Response Parser** | During Phase 2 | `src/services/response-parser.ts`. This is the trust boundary. Verify every pipeline step, every error path, DOMPurify integration. |
| **System Prompt** | During Phase 2 | The system prompt before any live API testing. Confirm delimiter contract, JSON schema, persona instructions. |
| **Edge Function Proxy** | During Phase 2 | `api/chat.ts`. Verify: API key is read from env only, request is validated, response is proxied without modification, rate limiting is present. |
| **Design System** | End of Phase 0 | Tailwind config output. Confirm color palette, typography, spacing tokens meet accessibility contrast requirements. |
| **E2E Results** | End of Phase 5 | Full Playwright report. All 4 user journeys pass. axe-core zero violations. Cross-browser pass. |
| **Pre-Deployment** | Start of Phase 6 | Production Vercel config, environment variables, Sentry DSN, CSP headers in `vercel.json`. |

---

## 6. Security Checklist

Applied throughout all phases:

- [ ] API key stored as Vercel env var only — never in source, never in client bundle
- [ ] Edge Function proxy validates request shape before forwarding
- [ ] All API response text sanitized with DOMPurify before rendering
- [ ] Left Rail inputs validated against enum values before API request construction
- [ ] Chat input trimmed, length-limited (2000 chars), control characters stripped
- [ ] CSP headers configured in `vercel.json` (see spec: `default-src 'self'`, `connect-src` limited to self + `api.anthropic.com`)
- [ ] Rate limiting: 30 requests/IP/5min at edge, debounce (500ms) on client
- [ ] All dependencies pinned to exact versions
- [ ] `npm audit --audit-level=high` in CI pipeline — fails on critical/high
- [ ] No `dangerouslySetInnerHTML` without DOMPurify preprocessing
- [ ] Session ID is a UUID generated per page load — never persisted

---

## 7. Accessibility Requirements

Target: WCAG 2.1 Level AA. Non-negotiable for an education tool.

- **Landmarks:** Left Rail = `role="navigation"`, Chat = `role="log"`, Workspace = `role="region"` with `aria-label="Evidence Strategies"`, main content = `role="main"`
- **Live regions:** Chat MessageList = `aria-live="polite"`, Workspace = `aria-live="assertive"` for strategy updates
- **Status:** Loading states use `role="status"` announcing "Loading strategies..." / "Strategies loaded"
- **Strategy cards:** `role="article"`, selection via `aria-selected`
- **Focus management:** Workspace updates do NOT auto-focus. A visually hidden announcement is made via aria-live. Export modal traps focus and returns on dismiss.
- **Keyboard:** All controls reachable via Tab. Dropdowns: Arrow keys + Enter/Escape. Radio groups: Arrow keys. Cards: Enter/Space to select. Export modal: Escape to close.
- **Contrast:** 4.5:1 minimum for normal text. 3:1 for large text. 3:1 for focus indicators. Forced-colors media query fallback.
- **Color independence:** Error states use icons + text, not color alone.

---

## 8. Performance Budget

| Metric | Target |
|---|---|
| LCP | <2.0s |
| FID | <100ms |
| CLS | <0.1 |
| TTI | <3.0s |
| Bundle size (gzipped) | <200KB |
| API response parse time | <50ms for 50KB payload |
