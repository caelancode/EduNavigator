import { useCallback } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import {
  MOCK_LEFT_RAIL_STATE,
  MOCK_CHAT_MESSAGES,
  MOCK_STRATEGIES,
} from '../../constants/mock-dev-data';

export function DevLoadButton() {
  const { dispatch: leftRailDispatch } = useLeftRail();
  const { dispatch: chatDispatch } = useChat();
  const { setStrategies, setError } = useWorkspace();
  const { setPhase, incrementGeneration } = useCrossReference();

  const handleClick = useCallback(() => {
    // 1. Populate left rail
    leftRailDispatch({ type: 'RESTORE', payload: MOCK_LEFT_RAIL_STATE });

    // 2. Reset chat and inject mock messages
    chatDispatch({ type: 'CLEAR_HISTORY' });
    for (const msg of MOCK_CHAT_MESSAGES) {
      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      });
    }

    // 3. Populate workspace strategies
    setStrategies(MOCK_STRATEGIES);
    setError(null);

    // 4. Update cross-reference state
    setPhase('idle');
    incrementGeneration();
  }, [
    leftRailDispatch,
    chatDispatch,
    setStrategies,
    setError,
    setPhase,
    incrementGeneration,
  ]);

  if (!import.meta.env.DEV) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Load mock data (dev only)"
      className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-200 shadow-sm transition-all hover:bg-amber-500/30 active:scale-95 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-primary-800"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 3h6v7l3 5H6l3-5V3z" />
        <path d="M6 15h12v3a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3z" />
        <path d="M10 3v7" />
        <path d="M14 3v7" />
      </svg>
      Dev Mock
    </button>
  );
}
