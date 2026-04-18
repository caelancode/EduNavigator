declare const process: { env: Record<string, string | undefined> };

import {
  SYSTEM_PROMPT,
  buildContextString,
} from '../src/constants/system-prompt';

interface RequestBody {
  sessionId: string;
  message: string;
  context: Record<string, unknown>;
  history: Array<{
    id: string;
    role: string;
    content: string;
    timestamp: number;
  }>;
  strategiesDelivered?: boolean;
}

function isValidRequest(body: unknown): body is RequestBody {
  if (typeof body !== 'object' || body === null) return false;
  const obj = body as Record<string, unknown>;
  return (
    typeof obj.sessionId === 'string' &&
    typeof obj.message === 'string' &&
    obj.message.length > 0 &&
    obj.message.length <= 2000 &&
    typeof obj.context === 'object' &&
    obj.context !== null &&
    Array.isArray(obj.history)
  );
}

// In-memory rate limiter: 30 requests per IP per 5 minutes
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();

  // Clean up expired entries periodically (every 100 checks)
  if (rateLimitMap.size > 1000) {
    for (const [key, entry] of rateLimitMap) {
      if (now >= entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Server configuration error', { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!isValidRequest(body)) {
    return new Response('Invalid request format', { status: 400 });
  }

  const contextString = buildContextString(body.context);
  const deliveryState = body.strategiesDelivered
    ? '\n\nSTRATEGY DELIVERY STATE: Strategies HAVE been delivered in this session.'
    : '\n\nSTRATEGY DELIVERY STATE: Strategies have NOT yet been delivered in this session.';
  const systemPrompt = SYSTEM_PROMPT + contextString + deliveryState;

  const messages = [
    ...body.history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user' as const, content: body.message },
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      }),
    });

    if (response.status === 429) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': response.headers.get('Retry-After') ?? '60',
        },
      });
    }

    if (!response.ok) {
      return new Response('Upstream error', { status: 502 });
    }

    const data = await response.json();
    const textContent = data.content?.find(
      (block: { type: string }) => block.type === 'text',
    );
    const text = textContent?.text ?? '';

    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch {
    return new Response('Gateway error', { status: 502 });
  }
}

export const config = {
  runtime: 'edge',
};
