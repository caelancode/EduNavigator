import { useCallback } from 'react';
import { Button } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { sendMessage } from '../../services/customgpt';

const PROJECT_ID = 'edunavigator';

export function UpdateGuidanceButton() {
  const { state: leftRailState } = useLeftRail();
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { setStrategies, setLoading, setError } = useWorkspace();

  const hasMinimumSelections =
    leftRailState.gradeBand !== null &&
    leftRailState.setting !== null &&
    leftRailState.supportArea !== null;

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
    <div className="pt-2">
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!hasMinimumSelections || chatState.isLoading}
        isLoading={chatState.isLoading}
        onClick={handleClick}
        aria-label={
          hasMinimumSelections
            ? 'Update guidance based on current selections'
            : 'Select at least grade band, setting, and support area to continue'
        }
      >
        Update Guidance
      </Button>
      {!hasMinimumSelections && (
        <p className="mt-1.5 text-center text-xs text-neutral-500">
          Select grade band, setting, and support area to continue
        </p>
      )}
    </div>
  );
}
