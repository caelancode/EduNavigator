/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { SYSTEM_PROMPT, buildContextString } from './src/constants/system-prompt';

interface HistoryMessage {
  id: string;
  role: string;
  content: string;
  timestamp: number;
}

interface RequestBody {
  sessionId: string;
  message: string;
  context: Record<string, unknown>;
  history: HistoryMessage[];
  strategiesDelivered?: boolean;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(
            '/api/chat',
            (req: IncomingMessage, res: ServerResponse) => {
              if (req.method !== 'POST') {
                res.statusCode = 405;
                res.end('Method not allowed');
                return;
              }

              const apiKey = env.ANTHROPIC_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(
                  'Missing ANTHROPIC_API_KEY — create .env.local with ANTHROPIC_API_KEY=your-key',
                );
                return;
              }

              const chunks: Buffer[] = [];
              req.on('data', (chunk: Buffer) => chunks.push(chunk));
              req.on('end', () => {
                void (async () => {
                  try {
                    const body = JSON.parse(
                      Buffer.concat(chunks).toString(),
                    ) as RequestBody;

                    const contextString = buildContextString(body.context);
                    const deliveryState = body.strategiesDelivered
                      ? '\n\nSTRATEGY DELIVERY STATE: Strategies HAVE been delivered in this session.'
                      : '\n\nSTRATEGY DELIVERY STATE: Strategies have NOT yet been delivered in this session.';
                    const systemPrompt = SYSTEM_PROMPT + contextString + deliveryState;

                    const messages = [
                      ...body.history
                        .filter(
                          (m) => m.role === 'user' || m.role === 'assistant',
                        )
                        .map((m) => ({
                          role: m.role as 'user' | 'assistant',
                          content: m.content,
                        })),
                      { role: 'user' as const, content: body.message },
                    ];

                    const anthropicRes = await fetch(
                      'https://api.anthropic.com/v1/messages',
                      {
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
                      },
                    );

                    if (!anthropicRes.ok) {
                      res.statusCode = 502;
                      res.end(`Anthropic API error: ${anthropicRes.status}`);
                      return;
                    }

                    const data = (await anthropicRes.json()) as {
                      content?: Array<{ type: string; text?: string }>;
                    };
                    const text =
                      data.content?.find((b) => b.type === 'text')?.text ?? '';

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(text);
                  } catch {
                    res.statusCode = 500;
                    res.end('Dev API error');
                  }
                })();
              });
            },
          );
        },
      },
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/__tests__/setup.ts',
      css: true,
    },
  };
});
