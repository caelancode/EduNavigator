interface RequestBody {
  projectId: string;
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

const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

function isValidRequest(body: unknown): body is RequestBody {
  if (typeof body !== 'object' || body === null) return false;
  const obj = body as Record<string, unknown>;
  return (
    typeof obj.projectId === 'string' &&
    SAFE_ID_PATTERN.test(obj.projectId) &&
    typeof obj.sessionId === 'string' &&
    SAFE_ID_PATTERN.test(obj.sessionId) &&
    typeof obj.message === 'string' &&
    obj.message.length > 0 &&
    obj.message.length <= 2000 &&
    typeof obj.context === 'object' &&
    obj.context !== null &&
    Array.isArray(obj.history)
  );
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.CUSTOMGPT_API_KEY;
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

  try {
    const response = await fetch(
      `https://app.customgpt.ai/api/v1/projects/${body.projectId}/conversations/${body.sessionId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          prompt: body.message,
        }),
      },
    );

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

    const data = await response.text();
    return new Response(data, {
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
