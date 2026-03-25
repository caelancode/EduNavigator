import type { ApiResult } from '../types/api';
import type { LeftRailState } from '../types/left-rail';
import type { ChatMessage } from '../types/chat';
import { parseResponse } from './response-parser';
import { buildApiRequest } from './request-builder';

const API_TIMEOUT = 30000;
const API_ENDPOINT = '/api/chat';

export async function sendMessage(
  message: string,
  context: LeftRailState,
  history: ChatMessage[],
  sessionId: string,
  projectId: string,
): Promise<ApiResult> {
  const request = buildApiRequest(
    context,
    message,
    history,
    sessionId,
    projectId,
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return {
        ok: false,
        error: {
          code: 'rate_limited',
          message: 'Too many requests. Please wait before trying again.',
        },
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: 'network_error',
          message: `Server responded with status ${response.status}.`,
        },
      };
    }

    const raw = await response.text();
    return parseResponse(raw);
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        ok: false,
        error: {
          code: 'timeout',
          message: 'The request timed out. Please try again.',
        },
      };
    }

    return {
      ok: false,
      error: {
        code: 'network_error',
        message: 'A network error occurred. Please check your connection.',
      },
    };
  }
}
