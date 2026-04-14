import { useState, useEffect } from 'react';
import { OwlAvatar } from './ChatMessage';

interface TypingIndicatorProps {
  onCancel?: () => void;
}

export function TypingIndicator({ onCancel }: TypingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-6 flex w-full items-center justify-start gap-3" role="status">
      <div className="flex max-w-[85%] flex-row gap-3">
        <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
          <OwlAvatar className="h-4 w-4" />
        </div>
        <div className="flex h-[52px] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-chat-ai px-5 py-4 shadow-sm">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-400 motion-reduce:animate-none"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-400 motion-reduce:animate-none"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-400 motion-reduce:animate-none"
            style={{ animationDelay: '300ms' }}
          />
          {elapsed > 3 && (
            <span className="ml-1.5 text-xs tabular-nums text-neutral-400">
              {elapsed}s
            </span>
          )}
        </div>
      </div>
      {elapsed > 8 && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-500 underline hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Cancel
        </button>
      )}
      <span className="sr-only">Assistant is typing...</span>
    </div>
  );
}
