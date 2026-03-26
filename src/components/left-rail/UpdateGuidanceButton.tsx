import { useCallback } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { sendMessage } from '../../services/customgpt';

export function UpdateGuidanceButton() {
  const { state: leftRailState } = useLeftRail();
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { strategies, setStrategies, setLoading, setError } = useWorkspace();

  const hasMinimumSelections =
    leftRailState.gradeBand !== null &&
    leftRailState.setting !== null &&
    leftRailState.supportArea !== null;

  const buttonLabel = strategies.length > 0 ? 'Update Strategies' : 'Get Strategies';

  const handleClick = useCallback(async () => {
    if (!hasMinimumSelections || chatState.isLoading) return;

    const message =
      'Please provide evidence-based strategies based on my current selections.';

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now(),
    };

    chatDispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    chatDispatch({ type: 'SET_LOADING', payload: true });
    setLoading(true);

    const result = await sendMessage(
      message,
      leftRailState,
      [...chatState.messages, userMessage],
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
  }, [
    hasMinimumSelections,
    chatState.isLoading,
    chatState.messages,
    chatState.sessionId,
    leftRailState,
    chatDispatch,
    setStrategies,
    setLoading,
    setError,
  ]);

  return (
    <div>
      <button
        type="button"
        disabled={!hasMinimumSelections || chatState.isLoading}
        onClick={handleClick}
        aria-label={
          hasMinimumSelections
            ? `${buttonLabel} based on current selections`
            : 'Select at least grade band, setting, and support area to continue'
        }
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 py-3.5 font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:bg-accent-400 hover:shadow focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-rail disabled:pointer-events-none disabled:opacity-50"
      >
        {chatState.isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 3v3" />
            <path d="M18.36 5.64l-2.12 2.12" />
            <path d="M21 12h-3" />
            <path d="M18.36 18.36l-2.12-2.12" />
            <path d="M12 21v-3" />
            <path d="M5.64 18.36l2.12-2.12" />
            <path d="M3 12h3" />
            <path d="M5.64 5.64l2.12 2.12" />
          </svg>
        )}
        {buttonLabel}
      </button>
      {!hasMinimumSelections && (
        <p className="mt-2 text-center text-xs text-neutral-600">
          Select grade band, setting, and support area to continue
        </p>
      )}
    </div>
  );
}
