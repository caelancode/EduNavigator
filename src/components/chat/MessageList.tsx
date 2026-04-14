import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { ChatMessage } from './ChatMessage';
import { WelcomeMessage } from './WelcomeMessage';
import { TypingIndicator } from './TypingIndicator';

export function MessageList() {
  const { state: chatState } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isUserScrolled, setIsUserScrolled] = useState(false);

  // Detect if user has scrolled up (to avoid jumping them back down)
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsUserScrolled(distanceFromBottom > 80);
  }, []);

  // Auto-scroll to bottom on new messages (unless user scrolled up)
  useEffect(() => {
    if (!isUserScrolled) {
      if (typeof bottomRef.current?.scrollIntoView === 'function') {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [chatState.messages, chatState.isLoading, isUserScrolled]);

  const visibleMessages = chatState.messages.filter((m) => !m.hidden);

  // Show WelcomeMessage (topic cards) when at landing stage with only the initial welcome message
  const isWelcomeOnly =
    chatState.intakeStage === 'landing' &&
    visibleMessages.length <= 1;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative flex flex-1 flex-col overflow-y-scroll overflow-x-hidden overscroll-y-contain"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="space-y-5 px-4 py-5 sm:px-6">
        {isWelcomeOnly ? (
          <WelcomeMessage />
        ) : (
          visibleMessages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isAnswered={
                msg.role === 'assistant' &&
                i < visibleMessages.length - 1 &&
                (
                  // Check ALL messages (including hidden) for a subsequent user message,
                  // because "Find Strategies" sends a hidden user message.
                  chatState.messages
                    .slice(chatState.messages.findIndex((m) => m.id === msg.id) + 1)
                    .some((m) => m.role === 'user') ||
                  // Also supersede if a later visible message has its own actionButton
                  // (context update case).
                  (msg.actionButton !== undefined &&
                    visibleMessages.slice(i + 1).some((m) => m.actionButton !== undefined))
                )
              }
            />
          ))
        )}
        {chatState.isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
