import type { LeftRailState } from '../types/left-rail';
import type { ChatMessage } from '../types/chat';
import type { ApiRequest } from '../types/api';

// Keep only the most recent messages to prevent unbounded context growth
const MAX_HISTORY_MESSAGES = 20;

export function buildApiRequest(
  context: LeftRailState,
  message: string,
  history: ChatMessage[],
  sessionId: string,
): ApiRequest {
  // Filter out system messages, local guided-intake messages, and the static welcome message
  const conversationHistory = history.filter(
    (msg) => msg.role !== 'system' && msg.id !== 'welcome' && !msg.local,
  );
  const windowedHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

  return {
    sessionId,
    message: sanitizeInput(message),
    context,
    history: windowedHistory.map((msg) => ({
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
