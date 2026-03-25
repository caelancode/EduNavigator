# EduNavigator — Comprehensive Audit Prompt

> **Instructions:** You are receiving this document along with (1) the original project plan (`CLAUDE.md`) and (2) the full EduNavigator codebase. Your job is to conduct three independent audit passes, then synthesize findings into actionable deliverables. You did not build this app. Approach it with fresh eyes and healthy skepticism.

---

## Codebase Orientation

EduNavigator is a stateless React 18 SPA that helps educators find evidence-based strategies for students with significant cognitive disabilities. It was built over 6 phases in a single session by a Claude instance following the spec in `CLAUDE.md`.

### Architecture (How Data Flows)

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
ApiResult discriminated union: { ok: true, chatText, strategies } | { ok: false, error, chatText? }
    ↓
chatText → ChatContext → Chat panel (MessageList)
strategies → WorkspaceContext → Workspace panel (StrategyCards)
```

### File Structure (Key Paths)

```
api/chat.ts                          ← Vercel Edge Function (CRITICAL: trust boundary #1)
src/services/
  response-parser.ts                 ← Response parsing pipeline (CRITICAL: trust boundary #2)
  json-validator.ts                  ← Zod schema for Strategy objects
  request-builder.ts                 ← Builds API request, sanitizes input
  customgpt.ts                       ← API client (name is legacy — actually calls Claude)
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
  layout/                            ← AppShell, TopBar, ThreePanelLayout (responsive with mobile tabs)
  ui/                                ← 8 shared primitives (Button, Dropdown, RadioGroup, MultiSelect, CollapsibleSection, Card, LoadingSpinner, ErrorBanner)
src/types/                           ← TypeScript interfaces (left-rail, chat, api, strategy, export)
src/constants/left-rail-options.ts   ← All dropdown/radio option arrays with labels
src/__tests__/                       ← 115 tests across 20 files
```

### Commands

```bash
npm run typecheck    # tsc --noEmit (should be 0 errors)
npm run lint         # eslint (should be 0 errors, 7 warnings from react-refresh on context files)
npm test             # vitest run (should be 115/115 passing)
npm run build        # tsc && vite build (should produce ~83KB gzipped bundle)
```

### Known API Pivot

The original `CLAUDE.md` spec references "CustomGPT" as the AI backend. During development, CustomGPT required a business email to sign up, so the backend was switched to the **Anthropic Claude API** (Messages API, claude-sonnet-4-20250514). The file `src/services/customgpt.ts` retains the legacy name. The Edge Function at `api/chat.ts` calls the Anthropic API directly and embeds the system prompt. This pivot is NOT reflected in `CLAUDE.md` — treat the spec's CustomGPT references as "the AI backend" generically.

---

## Builder's Honest Self-Assessment

I built this. Here's where I know the weaknesses are. **Dig into these areas first.**

### Areas I'm Least Confident About

1. **Duplicated message-sending logic.** `ChatInput.tsx` and `UpdateGuidanceButton.tsx` contain nearly identical 40-line blocks for constructing messages, dispatching to contexts, calling `sendMessage()`, and handling results. This should have been extracted to a `useSendMessage()` hook. It wasn't. Check both files — they could drift apart silently.

2. **Error display is split and inconsistent.** When an API call fails, the error message goes to BOTH `ChatContext.state.error` (displayed as a banner in `ChatPanel`) AND `WorkspaceContext.error` (displayed in `WorkspaceError`). These show different text for the same failure. A user sees two error messages with different wording. This is a real UX bug.

3. **System prompt is hardcoded in the Edge Function.** The entire system prompt (~2KB) is a string literal in `api/chat.ts`. To change the prompt, you must redeploy. The spec implied the prompt would be managed externally. This is a deployment friction issue, not a bug.

4. **No E2E tests.** The spec calls for Playwright E2E tests with axe-core integration. They were never written. The 115 tests are all unit/component-level via Vitest + React Testing Library. There is no automated cross-browser testing.

5. **The "LearnerPortrait" component is misnamed.** It only shows grade band, setting, grouping, and time — not the actual learner characteristics (communication level, mobility, sensory, behavioral). The spec says it should summarize the learner profile. It's more of a "ContextSummary" in practice.

6. **No first-use experience.** When you open the app, you see an empty Chat panel and an empty Workspace. There's a small text hint in the Chat empty state and another in the Workspace empty state, but no onboarding, no welcome message, no guided walkthrough. An educator opening this for the first time may have no idea what to do.

7. **No loading animation on Workspace transition.** When strategies arrive, they just appear. No entrance animation, no staggered reveal. The spec mentions "ARIA live region announcements on Workspace updates" which we have, but the visual transition is abrupt.

8. **Export is print-only.** The spec mentions `@react-pdf/renderer` as a fallback for PDF download. Only `window.print()` was implemented. Some educators may not understand "print to PDF" workflows.

9. **Chat persona is undefined on the client side.** The system prompt in `api/chat.ts` defines "Sage Buddy and Advisor" but there's no persona name, avatar, or branding in the Chat UI itself. Assistant messages look generic.

10. **No rate limiting on the client.** The spec calls for "30 requests/IP/5min at edge, debounce (500ms) on client." The client debounce exists (500ms in ChatInput). The edge-level rate limiting does NOT exist — we only check if the upstream API returns 429. There's no server-side rate limiter in `api/chat.ts`.

### Areas That Are Solid

- **Response parser** — Full 8-step pipeline, all 11 adversarial test cases passing, DOMPurify sanitization on every field. This is the strongest module.
- **TypeScript strictness** — `strict: true`, no `any`, no `@ts-ignore` anywhere. Types match the spec exactly.
- **Accessibility foundations** — Skip-to-content link, ARIA landmarks on all panels, `aria-live` regions, keyboard-navigable tabs, forced-colors fallback, focus-visible indicators.
- **Left Rail** — All 13 components work, state flows correctly, SubArea conditionally appears based on SupportArea, minimum selections gate the Update Guidance button.
- **Test coverage on services** — Response parser (15 tests), JSON validator (9 tests), request builder (4 tests), ChatContext reducer (4 tests), WorkspaceContext (6 tests). Services are well-tested.
- **Security posture** — API key server-side only, CSP headers configured, DOMPurify on all inbound content, input sanitization (2000 char limit, control char stripping), path parameter validation on Edge Function.

---

## PASS 1: Engineering Audit (Senior Engineer Lens)

Approach this as a senior engineer doing a pre-production code review. You are deciding whether this is ready for educators to use.

### 1.1 Specification Compliance Matrix

Open `CLAUDE.md` and go through it section by section. For every requirement, check whether the implementation matches. Produce a table:

| Section | Requirement | Status | Notes |
|---|---|---|---|
| §1 | Stateless SPA, no database | ? | Check for any persistence |
| §1 | Single API call per interaction | ? | Check both ChatInput and UpdateGuidanceButton |
| ... | ... | ... | ... |

Status values: `✅ Implemented` | `⚠️ Partially` | `❌ Missing` | `↔️ Deviated`

**Pay special attention to:**
- §2 Tech Stack — verify every library listed is actually used and at the specified version. Check `package.json`.
- §4 Component Map — verify every component listed exists. Check for any missing components.
- §7 CustomGPT Integration Spec — the response parser pipeline, delimiter contract, error taxonomy. This is the most critical section. Line-by-line.
- §10 Security Checklist — every bullet point. Grep the `dist/` build output for API keys. Check CSP headers in `vercel.json`. Verify rate limiting (spoiler: edge-level rate limiting is missing).
- §11 Accessibility Requirements — check every landmark, live region, keyboard interaction, contrast requirement against the actual implementation.

### 1.2 Code Quality Review

For each of these files, assess whether the code reads like senior-level TypeScript:

- `src/services/response-parser.ts` — Is the 8-step pipeline clear? Are edge cases handled? Could a new developer understand it?
- `api/chat.ts` — Is the Edge Function secure? Is the system prompt well-structured? Is input validation sufficient?
- `src/contexts/WorkspaceContext.tsx` — Is the state management pattern clean? Any unnecessary re-renders from context value changes?
- `src/components/chat/ChatInput.tsx` — Is the message-sending logic clean? Spot the duplication with `UpdateGuidanceButton.tsx`.
- `src/components/workspace/StrategyCard.tsx` — Is the component composition good? Check the sub-component pattern.

Look for:
- Any `any` types (there should be zero)
- Any `@ts-ignore` or `@ts-expect-error` (there should be zero)
- Unhandled async operations (missing try/catch)
- React hook dependency array issues (missing deps, stale closures)
- Unnecessary re-renders from context consumption patterns

### 1.3 Security Deep Dive

- Run `npm run build` then `grep -r "ANTHROPIC\|API_KEY\|sk-ant" dist/` — verify zero matches.
- Review `api/chat.ts` lines 14–30: Is `isValidRequest()` sufficient? What could a malicious client send?
- Review `src/services/request-builder.ts` line 30: The control character regex uses an eslint-disable comment. Is the regex correct?
- Review `vercel.json` CSP: Is `connect-src` appropriately restrictive? Should `style-src 'unsafe-inline'` be there?
- Check: Is `sessionId` validated anywhere? It's `crypto.randomUUID()` on the client — could a malicious client send a crafted sessionId?

### 1.4 Response Parser Resilience

The response parser (`src/services/response-parser.ts`) is the trust boundary. Run the test suite and verify all 15 tests pass. Then consider these additional scenarios that may NOT be tested:

- What if Claude returns exactly 2 strategies instead of 3? (Legitimate use case — should work)
- What if there's extra whitespace or newlines around the delimiter?
- What if `how_to` contains 4,999 characters (just under the Zod max)?
- What if `title` contains markdown formatting (`**bold**`, `[links](url)`)?
- What if the JSON array contains 10 items instead of 3? (Should the parser cap it?)
- What if Claude ignores the system prompt and returns no delimiter at all? (Already tested — but verify the UX fallback is good)

### 1.5 Test Coverage Gaps

Map every source file to its test file. Identify untested components:

```
src/components/chat/ChatMessage.tsx     → ? (no dedicated test)
src/components/chat/ChatCopyButton.tsx  → ? (no dedicated test)
src/components/chat/TypingIndicator.tsx → ? (no dedicated test)
src/components/chat/MessageList.tsx     → ? (no dedicated test)
src/components/export/ExportStrategyPage.tsx → ? (no dedicated test)
src/components/workspace/WhyFits.tsx    → ? (no dedicated test)
src/components/workspace/HowTo.tsx      → ? (no dedicated test)
src/components/workspace/SourceReference.tsx → ? (no dedicated test)
src/components/workspace/StrategyTitle.tsx  → ? (no dedicated test)
src/components/workspace/WorkspaceEmpty.tsx → ? (no dedicated test)
src/components/workspace/WorkspaceLoading.tsx → ? (no dedicated test)
src/services/customgpt.ts              → ? (no dedicated test — mocking fetch)
src/services/error-handler.ts          → ? (no dedicated test)
src/utils/sentry.ts                    → ? (no dedicated test)
```

Note: Some of these are tested indirectly through parent component tests. Flag which are covered indirectly vs. truly untested.

Also note: **No E2E tests exist.** The spec requires Playwright with axe-core. This is a significant gap.

---

## PASS 2: Educator Experience Audit (UX + Simulated User Testing)

### 2.1 Simulated User Testing Sessions

Conduct five simulated user testing sessions. For each persona, walk through the app as that person would. Document:
- **First impression** (what do they see? do they know what this is?)
- **Task:** Configure context → Get strategies → Review a strategy → Export it
- **Time to orient** (how long before they understand the interface?)
- **Friction points** (where do they get stuck?)
- **Trust signals** (do they trust the strategies? the citations? the AI?)
- **Likelihood of return** (would they come back? would they recommend it?)

**Persona 1: Maya — First-Year Special Education Teacher**
- 24 years old, first teaching job, overwhelmed
- Comfortable with smartphones, less so with desktop apps
- Needs practical strategies she can use tomorrow
- Low confidence in her own expertise, looking for authority

**Persona 2: Tom — Veteran General Ed Teacher (25 years)**
- Skeptical of AI tools, "I've seen these fads come and go"
- Moderate tech skills, uses Google Classroom
- Has a new student with significant cognitive disabilities in his class for the first time
- Needs to be convinced this tool knows what it's talking about

**Persona 3: Dr. Reyes — Speech-Language Pathologist**
- Doctoral-level clinician, evidence-based practice is her life
- Will immediately check whether citations are real
- High tech fluency
- Looking for strategies specifically for communication support
- Will judge the tool's credibility by source quality

**Persona 4: James — Paraprofessional**
- Told by his supervisor to "check out this tool and see if it's useful"
- Low tech confidence, prefers step-by-step instructions
- May not know educational terminology like "systematic prompting" or "time delay"
- Needs everything to be plain language

**Persona 5: Principal Okafor — Building Administrator**
- Evaluating whether to recommend this to her 40-person staff
- Will spend 3 minutes max before forming an opinion
- Cares about: professional appearance, evidence base, ease of use, accessibility compliance
- Won't actually use strategies — assessing the tool itself

### 2.2 Nielsen's 10 Heuristics Evaluation

Apply each heuristic to each of the four surfaces. Rate violations 0 (none) to 4 (catastrophic).

| Heuristic | Left Rail | Chat | Workspace | Export |
|---|---|---|---|---|
| 1. Visibility of system status | | | | |
| 2. Match between system and real world | | | | |
| 3. User control and freedom | | | | |
| 4. Consistency and standards | | | | |
| 5. Error prevention | | | | |
| 6. Recognition rather than recall | | | | |
| 7. Flexibility and efficiency of use | | | | |
| 8. Aesthetic and minimalist design | | | | |
| 9. Help users recognize/recover from errors | | | | |
| 10. Help and documentation | | | | |

### 2.3 User-Facing Text Audit

Review EVERY piece of user-facing text in the app:

- Button labels: "Update Guidance", "Send", "Export", "Copy", "Dismiss error"
- Placeholders: "Select grade band...", "Type a message...", etc.
- Empty states: Chat empty message, Workspace empty message
- Error messages: All 9 error types (see `src/services/error-handler.ts`)
- Loading messages: "Finding evidence-based strategies..."
- Section headers: "Learner Characteristics", "Technology Context", "Output Preferences", etc.
- Portrait display: "Current Context" label
- Export header: "EduNavigator — Strategy Report", "Educator Context"

For each: Is it plain language? Would a paraprofessional with no EdTech background understand it immediately? Flag anything that assumes knowledge.

### 2.4 Chat Persona Audit

Read the system prompt in `api/chat.ts` (lines 29–69). Then review how assistant messages display in the Chat panel (`src/components/chat/ChatMessage.tsx`).

- Is there a persona name visible to the user? (No — it's just "assistant" styling)
- Is there an avatar or icon? (No)
- Does the persona introduce itself on first message? (Depends on Claude's response)
- Is the tone consistent with "warm, experienced colleague"?
- Is there any branding that says "this is EduNavigator's advisor"?

### 2.5 First-Use Experience Audit

Open the app cold. Document exactly what you see. Then answer:

- How many seconds until the user understands what this app does?
- Is there a welcome message? (No)
- Is there a tutorial or guided first step? (No)
- Does the empty state clearly communicate the workflow? (Partially — small text hints)
- Would a user know they need to fill out the Left Rail BEFORE chatting? (Unclear)
- Is the relationship between Left Rail, Chat, and Workspace obvious? (Not explained anywhere)

### 2.6 Citation Integrity Audit

This is **non-negotiable** for an education tool. Review:

- `src/components/workspace/SourceReference.tsx` — Is the citation prominently displayed on each card?
- Can a strategy card ever render without a citation? (Check Zod schema — `source_ref` is required, min 1 char)
- What happens if Claude fabricates a citation? Is there a disclaimer anywhere?
- Is there a way for the user to verify a citation? (No link, no DOI, no search prompt)
- **Recommendation needed:** Should there be a visible disclaimer like "AI-generated recommendations — verify sources independently"?

---

## PASS 3: Visual Design & Polish Audit (Design Critic Lens)

The benchmark is **Khanmigo by Khan Academy** — a polished, warm, trust-inspiring educational AI interface.

### 3.1 Visual Design Assessment

Evaluate the following against the Khanmigo standard:

- **Color palette:** The app uses blue primary / green secondary / neutral grays. Is this warm and approachable, or cold and clinical? Education tools should feel inviting.
- **Typography:** Inter font stack. Is the type hierarchy clear? Are headings, body, labels, and captions visually distinct?
- **Spacing and density:** Is the Left Rail too dense? Are strategy cards readable? Is there enough whitespace?
- **Iconography:** The app uses almost no icons (just the workspace empty state book icon and chevrons in collapsible sections). Khanmigo uses rich iconography. Gap?
- **Visual warmth:** Does this feel like a tool built for teachers, or a developer's admin panel?

### 3.2 Interaction Design Assessment

- **Loading states:** When "Update Guidance" is clicked, what does the user see? Is there a skeleton screen? Progress indicator? Just a spinner? How long does it feel?
- **Strategy card transitions:** Do cards animate in, or just appear?
- **Mobile tab switching:** Is the transition smooth or jarring?
- **Selection feedback:** When a strategy card is selected for export, is the visual feedback clear and satisfying?
- **Error recovery:** When an API call fails, is the retry path obvious?
- **Chat scroll:** Does auto-scroll to new messages feel natural?

### 3.3 Khanmigo Benchmark Comparison

Rate each dimension. Values: `Exceeds` | `Matches` | `Below` | `Significantly Below`

| Dimension | Rating | Notes |
|---|---|---|
| Visual warmth and approachability | | |
| First-visit clarity / onboarding | | |
| Typography quality | | |
| Loading state design | | |
| Error state design | | |
| Chat UI design (bubbles, persona, flow) | | |
| Trust signals (branding, citations, tone) | | |
| Mobile responsiveness | | |
| Interaction polish (animations, feedback) | | |
| Overall professional quality | | |

### 3.4 Gemini Prompt Package

Write **three ready-to-paste prompts** for Gemini 2.5 Pro. These should be self-contained — I will paste them into Gemini along with screenshots of the current app.

**Prompt 1: Visual Design Review**
Write a prompt that asks Gemini to evaluate screenshots of EduNavigator against Khanmigo's design language. Ask for specific Tailwind CSS recommendations: color palette changes, spacing adjustments, typography improvements, component-level design fixes. The prompt should reference that this is an education tool for educators with varying tech fluency.

**Prompt 2: Component Redesign Recommendations**
Write a prompt that asks Gemini to redesign specific components: the Chat message bubbles, the StrategyCard layout, the Left Rail form design, the empty states, and the TopBar. Ask for detailed Tailwind class suggestions and layout changes.

**Prompt 3: Trust & Warmth Audit**
Write a prompt that asks Gemini to evaluate the app's trust signals, warmth, and approachability compared to Khanmigo. Ask for specific recommendations on: persona branding, welcome experience, citation display, color warmth, illustrations/icons to add, and micro-copy improvements.

---

## Deliverables

After completing all three passes, produce the following files in `docs/audit/`:

### 1. `docs/audit/compliance-matrix.md`
Full specification compliance matrix. Every requirement from `CLAUDE.md` mapped to implementation status.

### 2. `docs/audit/issues-register.md`
Deduplicated issues from all three passes. Table format:

| ID | Severity | Category | Description | Component | Recommended Fix |
|---|---|---|---|---|---|
| ISS-001 | Critical | Security | No edge-level rate limiting | api/chat.ts | Add IP-based rate limiter |
| ... | ... | ... | ... | ... | ... |

Severity: Critical / High / Medium / Low / Cosmetic
Category: Engineering / UX / Design / Security / Accessibility

Sort by severity, then by category.

### 3. `docs/audit/improvement-plan.md`
Issues grouped into four sprints:

- **Sprint 1 (Critical):** Must fix before any educator uses this. Security issues, data integrity, broken functionality.
- **Sprint 2 (High):** Significantly degrades experience. UX bugs, missing error handling, accessibility violations.
- **Sprint 3 (Medium):** Quality of life. Refactoring, visual polish, additional tests.
- **Sprint 4 (Low/Polish):** Nice-to-haves. Animations, onboarding, advanced features.

Include effort estimates: S (< 1 hour), M (1-4 hours), L (4-8 hours), XL (> 8 hours).

### 4. `docs/audit/gemini-prompts.md`
The three Gemini prompts from Pass 3, section 3.4. Self-contained, ready to paste.

### 5. `docs/audit/recommendations-beyond-spec.md`
What should we add that wasn't in the original spec? Consider:

- Trust mechanisms (disclaimers, citation verification, "AI-generated" labels)
- Onboarding / first-use experience
- Educator feedback mechanism (was this strategy helpful?)
- Session summary / history (within session, not persisted)
- Analytics (anonymous, no PII — what features do educators actually use?)
- System prompt improvements based on what you observed
- Accessibility improvements beyond WCAG AA
- Performance optimizations
- Error recovery UX patterns
- Anything else a senior product team would flag

---

## Final Notes for the Auditor

- **Be harsh.** The goal is to find every weakness before real educators use this. A missed issue now is a confused teacher later.
- **Contradictions between passes are valuable.** If Pass 1 says "code is clean" but Pass 2 says "users are confused," that's important signal — clean code doesn't mean good UX.
- **Prioritize educator impact.** A cosmetic issue that confuses a low-tech teacher is more important than a code smell that only bothers engineers.
- **The response parser is the strongest module.** If you find issues there, they're significant. Spend time on it.
- **The first-use experience is the weakest area.** The builder knows it. Dig in.
- **Check whether the 115 tests actually test meaningful behavior**, not just "component renders without crashing." Some may be shallow.
