# EduNavigator

Evidence-based instructional strategy finder for educators working with students with significant cognitive disabilities. Stateless single-page app — no accounts, no persistence, no database.

## How It Works

Three panels: **Left Rail** (educator picks context — grade band, setting, support area, learner characteristics), **Chat** (conversation with an AI advisor), **Workspace** (0–3 strategy cards parsed from the AI response). One API call per interaction. Export selected strategies as a printable plan.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm test` | Run tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

## Environment Variables

| Variable | Where | What |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel env vars only | Claude API key (server-side, never in client) |
| `VITE_SENTRY_DSN` | `.env.local` or Vercel | Sentry error tracking DSN |

## AI Integration

Request flow: `ChatInput` or `UpdateGuidanceButton` → `useSendMessage` hook → `sendMessage()` (services/chat-service.ts) → `POST /api/chat` edge function → Claude API.

Response contract: `[conversational text]===STRATEGIES_JSON===[JSON array of strategies]`. The response parser splits on the delimiter, validates the JSON array with Zod, sanitizes all fields with DOMPurify, and returns typed `ApiResult`.

## Project Structure

```
src/
  components/
    chat/        — Chat panel, message list, input, follow-up pills
    workspace/   — Strategy cards, empty/loading/error states
    left-rail/   — Context form (grade band, setting, support area, etc.)
    export/      — Print-ready export view
    layout/      — App shell, 3-panel responsive layout, bottom sheet
    ui/          — Button, Dropdown, RadioGroup, MultiSelect, etc.
  contexts/      — LeftRailContext, ChatContext, WorkspaceContext
  services/      — API client, response parser, request builder, error handler
  hooks/         — useSendMessage, useLocalStoragePersistence
  types/         — TypeScript interfaces
  constants/     — Left rail option definitions
  __tests__/     — Service tests (parser, validator, builder) + smoke test
api/
  chat.ts        — Vercel Edge Function (system prompt, rate limiting, Claude API call)
```

## Tech Stack

React 18, Vite 5, TypeScript (strict), Tailwind CSS 3, Zod, DOMPurify, Vitest, Vercel Edge Functions, Sentry.

## Deployment

Connect to Vercel, set `ANTHROPIC_API_KEY` in environment variables, deploy. Vercel auto-detects Vite config.
