import { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

export function MessageList() {
  const { state } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);

  if (state.messages.length === 0 && !state.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-neutral-500">
            Select your context in the left panel and click &ldquo;Update
            Guidance&rdquo; to get started, or type a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto p-4"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {state.messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {state.isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
