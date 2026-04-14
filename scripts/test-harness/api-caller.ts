import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  SYSTEM_PROMPT,
  buildContextString,
} from '../../src/constants/system-prompt';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

let cachedApiKey: string | null = null;

function loadApiKey(): string {
  if (cachedApiKey) return cachedApiKey;
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf-8');
  const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m);
  if (!match) throw new Error('ANTHROPIC_API_KEY not found in .env.local');
  cachedApiKey = match[1].trim();
  return cachedApiKey;
}

interface CallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  rateLimitRemaining?: string;
}

export async function callApi(
  message: string,
  context: Record<string, unknown>,
  history: Array<{ id: string; role: string; content: string; timestamp: number }>,
  retries = 3,
): Promise<CallResult> {
  const apiKey = loadApiKey();
  const contextString = buildContextString(context);
  const systemPrompt = SYSTEM_PROMPT + contextString;

  const messages = [
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user' as const, content: message },
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    const start = Date.now();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages,
        }),
      });

      const rateLimitRemaining =
        response.headers.get('x-ratelimit-requests-remaining') ?? undefined;

      if (response.status === 429) {
        const waitMs = Math.pow(2, attempt) * 3000;
        console.log(
          `  Rate limited (429). Retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${retries})...`,
        );
        await sleep(waitMs);
        continue;
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `API returned ${response.status}: ${body.slice(0, 200)}`,
        );
      }

      const data = await response.json();
      const textBlock = data.content?.find(
        (b: { type: string }) => b.type === 'text',
      );
      const text = textBlock?.text ?? '';

      return {
        text,
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
        durationMs: Date.now() - start,
        rateLimitRemaining,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < retries - 1) {
        const waitMs = Math.pow(2, attempt) * 3000;
        console.log(
          `  Error: ${lastError.message}. Retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${retries})...`,
        );
        await sleep(waitMs);
      }
    }
  }

  throw lastError ?? new Error('All retries exhausted');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
