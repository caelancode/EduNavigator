import type { LeftRailState } from '../types/left-rail';
import type { ChatMessage } from '../types/chat';
import type { ApiRequest } from '../types/api';

export function buildApiRequest(
  context: LeftRailState,
  message: string,
  history: ChatMessage[],
  sessionId: string,
): ApiRequest {
  return {
    sessionId,
    message: sanitizeInput(message),
    context,
    history: history.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    })),
  };
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 2000)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}
