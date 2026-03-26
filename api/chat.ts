declare const process: { env: Record<string, string | undefined> };

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

const SYSTEM_PROMPT = `You are EduNavigator's Sage Buddy and Advisor — a warm, experienced
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
  "supporting_excerpt": "Direct quote or paraphrase from research",
  "source_ref": "Author (Year). Title. Publication."
}

CONSTRAINTS:
- Only recommend evidence-based strategies from peer-reviewed research
- Each source_ref must reference a real, published work
- Never fabricate sources or excerpts
- If fewer than 3 strategies are available, return what you have
  but always return the JSON array (even if empty: [])
- Match strategies to the educator's context (grade band, setting, tech, time, etc.)
- Never recommend strategies requiring technology the educator indicated is unavailable
- Always match the age/grade band

SAFETY GUARDRAILS:
- NEVER recommend restraint, seclusion, or aversive interventions
- NEVER provide medical, diagnostic, or therapeutic advice — refer educators to qualified professionals
- NEVER use deficit-focused or clinical language about students — use strengths-based, person-first language
- If asked about topics outside instructional strategy (medical questions, legal advice, diagnoses), politely redirect to the tool's purpose and suggest consulting appropriate professionals
- Do not make assumptions about a student's capabilities based solely on disability labels`;

const OUTPUT_PREFERENCE_INSTRUCTIONS: Record<string, string> = {
  step_by_step: 'The educator prefers step-by-step implementation guides. In your how_to fields, provide clear numbered steps that can be followed sequentially.',
  scripts: 'The educator prefers scripts and sample language. In your how_to fields, include example dialogue, sentence starters, or scripts they can use directly.',
  quick_ideas: 'The educator prefers quick, concise ideas. Keep your how_to fields brief and focused — bullet points rather than lengthy explanations.',
  rationale: 'The educator prefers detailed rationale. In your why_fits fields, provide deeper explanation of the research basis and reasoning behind each strategy.',
};

function buildContextString(context: Record<string, unknown>): string {
  const labels: Record<string, string> = {
    gradeBand: 'Grade/Age Band',
    setting: 'Setting',
    grouping: 'Grouping',
    timeRange: 'Time Available',
    techContext: 'Technology',
    supportArea: 'Support Area',
    subArea: 'Sub-Area',
    outputPreference: 'Output Preference',
    rolePerspective: 'Role Perspective',
  };

  const parts: string[] = [];
  for (const [key, label] of Object.entries(labels)) {
    const value = context[key];
    if (value && typeof value === 'string') {
      parts.push(`- ${label}: ${value}`);
    }
  }

  const chars = context.learnerCharacteristics;
  if (chars && typeof chars === 'object') {
    const c = chars as Record<string, string[]>;
    if (c.communicationLevel?.length)
      parts.push(`- Communication: ${c.communicationLevel.join(', ')}`);
    if (c.mobilityLevel?.length)
      parts.push(`- Mobility: ${c.mobilityLevel.join(', ')}`);
    if (c.sensoryConsiderations?.length)
      parts.push(`- Sensory: ${c.sensoryConsiderations.join(', ')}`);
    if (c.behavioralConsiderations?.length)
      parts.push(`- Behavioral: ${c.behavioralConsiderations.join(', ')}`);
  }

  let result = parts.length > 0
    ? `\n\nThe educator has provided the following context:\n${parts.join('\n')}`
    : '';

  const outputPref = context.outputPreference;
  if (typeof outputPref === 'string' && outputPref in OUTPUT_PREFERENCE_INSTRUCTIONS) {
    result += `\n\nOUTPUT FORMAT PREFERENCE:\n${OUTPUT_PREFERENCE_INSTRUCTIONS[outputPref]}`;
  }

  return result;
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
  const systemPrompt = SYSTEM_PROMPT + contextString;

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
