import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useGuidedIntake } from '../../hooks/useGuidedIntake';
const MAX_LENGTH = 2000;
const DEBOUNCE_MS = 500;

export function ChatInput() {
  const [input, setInput] = useState('');
  const [lastSentAt, setLastSentAt] = useState(0);
  const [justSent, setJustSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { send, isLoading } = useSendMessage();
  const intake = useGuidedIntake();

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const now = Date.now();
    if (now - lastSentAt < DEBOUNCE_MS) return;
    setLastSentAt(now);

    setInput('');
    setJustSent(true);
    setTimeout(() => setJustSent(false), 1000);

    // During guided intake, typing always fires the API with whatever context exists —
    // except during other_elaboration, which is handled as a local intake step.
    if (intake.stage === 'other_elaboration') {
      intake.elaborateOther(trimmed);
    } else if (intake.stage !== 'complete') {
      intake.skipToApi(trimmed);
    } else {
      await send(trimmed);
    }
  }, [input, isLoading, lastSentAt, send, intake]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  const charRatio = input.length / MAX_LENGTH;

  return (
    <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5">
<div className={`flex items-center gap-2 rounded-full border bg-white px-3 py-1 shadow-card transition-[border-color,box-shadow] duration-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 sm:gap-3 sm:px-4 sm:py-1.5 ${justSent ? 'animate-border-flash' : 'border-neutral-200'}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Describe your student or ask about a strategy..."
          maxLength={MAX_LENGTH}
          rows={1}
          className="max-h-[7.5rem] flex-1 resize-none bg-transparent py-1 text-sm leading-5 text-neutral-900 placeholder-neutral-600 focus:outline-none"
          aria-label="Chat message input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="btn-press flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:opacity-30 disabled:hover:bg-primary-600 sm:h-9 sm:w-9"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2.94 3.34a1 1 0 0 1 1.07-.14l13 6.5a1 1 0 0 1 0 1.79l-13 6.5A1 1 0 0 1 2.5 17V11.5l7.5-1.5-7.5-1.5V3a1 1 0 0 1 .44-.66Z" />
            </svg>
          )}
        </button>
      </div>
      {charRatio > 0.75 && (
        <div className="mt-1.5 flex items-center justify-end gap-2 text-xs text-neutral-400">
          <span className={`shrink-0 tabular-nums transition-colors duration-300 ${charRatio > 0.95 ? 'font-semibold text-error-500' : charRatio > 0.8 ? 'text-warning-500' : 'text-neutral-700'}`}>{input.length}/{MAX_LENGTH}</span>
        </div>
      )}
    </div>
  );
}
