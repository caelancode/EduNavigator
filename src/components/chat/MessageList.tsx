import { useEffect, useRef, useCallback } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { sendMessage } from '../../services/customgpt';
import { ChatMessage, OwlAvatar } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import {
  GRADE_BAND_OPTIONS,
  SUPPORT_AREA_OPTIONS,
  SETTING_OPTIONS,
  GROUPING_OPTIONS,
} from '../../constants/left-rail-options';
import type { LeftRailState } from '../../types/left-rail';

function buildContextualSuggestions(state: LeftRailState): string[] {
  const suggestions: string[] = [];
  const grade = GRADE_BAND_OPTIONS.find((o) => o.value === state.gradeBand)?.label;
  const area = SUPPORT_AREA_OPTIONS.find((o) => o.value === state.supportArea)?.label;
  const setting = SETTING_OPTIONS.find((o) => o.value === state.setting)?.label;
  const grouping = GROUPING_OPTIONS.find((o) => o.value === state.grouping)?.label;

  if (area && grade) {
    suggestions.push(`What ${area.toLowerCase()} strategies work for ${grade} students?`);
  } else if (area) {
    suggestions.push(`What are effective ${area.toLowerCase()} strategies?`);
  }

  if (setting && grouping) {
    suggestions.push(`Strategies that work in a ${setting.toLowerCase()} ${grouping.toLowerCase()} setting`);
  } else if (setting) {
    suggestions.push(`What works well in a ${setting.toLowerCase()} classroom?`);
  }

  if (suggestions.length < 3) {
    suggestions.push('What should I try with my students this week?');
  }
  if (suggestions.length < 3) {
    suggestions.push('Help me plan an activity based on my context');
  }

  return suggestions.slice(0, 3);
}

function WelcomeState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const { state: leftRail } = useLeftRail();

  const hasContext = leftRail.supportArea || leftRail.gradeBand || leftRail.setting;

  // Context-aware suggestions that reflect the educator's selections,
  // or broad open-ended prompts when no context is set
  const suggestions = hasContext
    ? buildContextualSuggestions(leftRail)
    : [
        'What strategies work well for my students?',
        'I need help planning a lesson',
        'How can I better support a struggling learner?',
      ];

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
        <OwlAvatar className="h-8 w-8" />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-neutral-800">
        Welcome to EduNavigator
      </h2>

      <p className="mb-6 text-lg text-neutral-600">
        I&apos;m here to help you find evidence-based strategies. How can I support your students today?
      </p>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-surface-100 px-6 py-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span>
          <span>Set context</span>
        </div>
        <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span>
          <span>Chat</span>
        </div>
        <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span>
          <span>View &amp; export strategies</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-full border border-primary-200 bg-primary-50 px-5 py-2.5 text-sm font-medium text-primary-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MessageList() {
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { state: leftRailState } = useLeftRail();
  const { setStrategies, setLoading, setError } = useWorkspace();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, chatState.isLoading]);

  const handleSuggestionClick = useCallback(
    async (text: string) => {
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: text,
        timestamp: Date.now(),
      };

      chatDispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      chatDispatch({ type: 'SET_LOADING', payload: true });
      setLoading(true);

      const result = await sendMessage(
        text,
        leftRailState,
        [userMessage],
        chatState.sessionId,
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
    },
    [chatDispatch, chatState.sessionId, leftRailState, setStrategies, setLoading, setError],
  );

  if (chatState.messages.length === 0 && !chatState.isLoading) {
    return <WelcomeState onSuggestionClick={handleSuggestionClick} />;
  }

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto p-4"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {chatState.messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {chatState.isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
