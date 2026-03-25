import { useState, useCallback, type KeyboardEvent } from 'react';
import { Button } from '../ui';
import { useChat } from '../../contexts/ChatContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { sendMessage } from '../../services/customgpt';

const MAX_LENGTH = 2000;
const DEBOUNCE_MS = 500;
const PROJECT_ID = 'edunavigator';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [lastSentAt, setLastSentAt] = useState(0);
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { state: leftRailState } = useLeftRail();
  const { setStrategies, setLoading, setError } = useWorkspace();

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || chatState.isLoading) return;

    const now = Date.now();
    if (now - lastSentAt < DEBOUNCE_MS) return;
    setLastSentAt(now);

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: trimmed,
      timestamp: now,
    };

    chatDispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    chatDispatch({ type: 'SET_LOADING', payload: true });
    setLoading(true);
    setInput('');

    const result = await sendMessage(
      trimmed,
      leftRailState,
      [...chatState.messages, userMessage],
      chatState.sessionId,
      PROJECT_ID,
    );

    chatDispatch({ type: 'SET_LOADING', payload: false });
    setLoading(false);

    if (result.ok) {
      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.chatText,
          timestamp: Date.now(),
        },
      });
      setStrategies(result.strategies);
    } else {
      if (result.chatText) {
        chatDispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.chatText,
            timestamp: Date.now(),
          },
        });
      }
      chatDispatch({ type: 'SET_ERROR', payload: result.error.message });
      setError({ code: result.error.code, message: result.error.message });
    }
  }, [
    input,
    chatState.isLoading,
    chatState.messages,
    chatState.sessionId,
    lastSentAt,
    leftRailState,
    chatDispatch,
    setStrategies,
    setLoading,
    setError,
  ]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-neutral-200 bg-white p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={2}
          maxLength={MAX_LENGTH}
          disabled={chatState.isLoading}
          className="flex-1 resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
          aria-label="Chat message input"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || chatState.isLoading}
          isLoading={chatState.isLoading}
          size="md"
        >
          Send
        </Button>
      </div>
      <div className="mt-1 text-right text-xs text-neutral-400">
        {input.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
