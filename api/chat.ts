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
- Always match the age/grade band`;

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

  return parts.length > 0
    ? `\n\nThe educator has provided the following context:\n${parts.join('\n')}`
    : '';
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
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
