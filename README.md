# EduNavigator

Evidence-based instructional strategy finder for educators working with students with significant cognitive disabilities.

## Architecture

Stateless single-page application with four surfaces:

- **Left Rail** — Structured input panel (grade band, setting, grouping, learner characteristics, etc.)
- **Chat** — Conversational interface connected to CustomGPT backend
- **Workspace** — Deterministic display of 0–3 validated strategy cards
- **Export** — Print-ready document with context header + selected strategies

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (SPA, no SSR) |
| Build | Vite 5 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 |
| State | React Context + useReducer |
| Validation | Zod |
| Sanitization | DOMPurify |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel (static + Edge Function) |
| Error Tracking | Sentry |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:5173

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check only |

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

| Variable | Where | Description |
|---|---|---|
| `CUSTOMGPT_API_KEY` | Vercel env vars (server-side) | API key for CustomGPT backend |
| `VITE_SENTRY_DSN` | `.env.local` or Vercel env vars | Sentry DSN for error tracking |

**Important:** `CUSTOMGPT_API_KEY` must only be set in Vercel's environment variables dashboard — never in client-side code or `.env` files committed to source control.

## Deployment

### Vercel

1. Connect repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `CUSTOMGPT_API_KEY` — your CustomGPT API key
   - `VITE_SENTRY_DSN` — your Sentry project DSN
3. Deploy — Vercel auto-detects Vite and configures build

The Edge Function at `api/chat.ts` proxies requests to CustomGPT, keeping the API key server-side.

### Vercel CLI (alternative)

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Project Structure

```
src/
├── components/
│   ├── chat/          # Chat panel (6 components)
│   ├── export/        # Export/print (4 components)
│   ├── layout/        # App shell + 3-panel layout
│   ├── left-rail/     # Input panel (13 components)
│   ├── ui/            # Shared primitives (8 components)
│   └── workspace/     # Strategy display (9 components)
├── contexts/          # React Context providers (4 files)
├── services/          # API client, parser, validator (5 files)
├── types/             # TypeScript interfaces (5 files)
├── constants/         # Option definitions
├── utils/             # Sentry init
└── __tests__/         # 115+ tests
api/
└── chat.ts            # Vercel Edge Function proxy
```

## Security

- API key stored as Vercel env var only — never in client bundle
- All API response text sanitized with DOMPurify
- Request inputs validated and length-limited
- CSP headers configured in vercel.json
- Edge Function validates request shape and sanitizes path parameters
- No PII collected or stored

## Accessibility

- WCAG 2.1 Level AA target
- Skip-to-content link
- ARIA landmarks on all panels
- Keyboard-navigable (Tab, Enter, Escape, Arrow keys)
- Screen reader live regions for strategy updates
- Forced-colors (high contrast) fallback
- Color-independent error indicators
