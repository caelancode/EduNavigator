import { useCallback, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useLeftRail, leftRailReducer } from '../contexts/LeftRailContext';
import type { LeftRailState } from '../types/left-rail';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useCrossReference } from '../contexts/CrossReferenceContext';
import { sendMessage } from '../services/chat-service';
import { extractCitations } from '../services/citation-extractor';

// Module-level flag shared across all useSendMessage instances — prevents concurrent API calls
// regardless of which component triggers them (wizard auto-advance, chat input, buttons, etc.)
const inFlight = { current: false };

export function useSendMessage() {
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { state: leftRailState, dispatch: leftRailDispatch } = useLeftRail();
  const { strategies, setStrategies, setLoading, setError } = useWorkspace();
  const {
    phase,
    setPhase,
    setCitations,
    incrementGeneration,
    strategyGeneration,
  } = useCrossReference();

  // Track whether strategies have been delivered at least once in this session
  const hasDeliveredStrategies = useRef(false);
  const lastFailedMessageRef = useRef<{ id: string; content: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string, options?: { hidden?: boolean; contextOverrides?: Partial<LeftRailState>; intakeCompletion?: boolean }) => {
      if (inFlight.current) return;
      inFlight.current = true;
      abortRef.current = new AbortController();

      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: text,
        timestamp: Date.now(),
        ...(options?.hidden && { hidden: true }),
      };

      chatDispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      chatDispatch({ type: 'SET_LOADING', payload: true });
      if (!options?.intakeCompletion) {
        setLoading(true);
      }

      // Phase transition: user action triggers reflection or exploration
      if (phase === 'idle') {
        setPhase('reflection');
      } else if (phase === 'research') {
        setPhase('exploration');
      }

      try {
        const effectiveContext = options?.contextOverrides
          ? { ...leftRailState, ...options.contextOverrides }
          : leftRailState;

        const result = await sendMessage(
          text,
          effectiveContext,
          [...chatState.messages, userMessage],
          chatState.sessionId,
          hasDeliveredStrategies.current,
          abortRef.current.signal,
        );

        chatDispatch({ type: 'SET_LOADING', payload: false });
        setLoading(false);

        if (result.ok) {
          lastFailedMessageRef.current = null;
          const assistantMessageId = crypto.randomUUID();
          const hasStrategies = result.strategies.length > 0;

          // Extract citations from chat text if strategies are present.
          // Pass the current strategy count as an offset so [1] in a second-turn
          // response maps to the correct global workspace index, not index 0.
          const citationOffset = hasStrategies ? strategies.length : 0;
          const citations = hasStrategies
            ? extractCitations(
                result.chatText,
                result.strategies.length,
                assistantMessageId,
                citationOffset,
              )
            : [];

          // Determine the new strategy generation (increments if strategies arrive)
          const currentGeneration = hasStrategies
            ? strategyGeneration + 1
            : strategyGeneration;

          chatDispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: assistantMessageId,
              role: 'assistant',
              content: result.chatText,
              timestamp: Date.now(),
              citations: citations.length > 0 ? citations : undefined,
              strategyGeneration: currentGeneration,
              nextQuestion: result.contextUpdate?.nextQuestion,
            },
          });

          // Compute the post-AI-update context synchronously so strategies are stored
          // against the state the AI produced, not the stale pre-call snapshot.
          // This prevents a false "Your settings have changed" banner after AI inference.
          const contextForStrategies =
            result.contextUpdate?.updates &&
            Object.keys(result.contextUpdate.updates).length > 0
              ? leftRailReducer(effectiveContext, {
                  type: 'APPLY_AI_UPDATE',
                  payload: result.contextUpdate.updates,
                })
              : effectiveContext;

          // Apply AI context extraction to left rail state
          if (result.contextUpdate?.updates && Object.keys(result.contextUpdate.updates).length > 0) {
            leftRailDispatch({
              type: 'APPLY_AI_UPDATE',
              payload: result.contextUpdate.updates,
            });
            // Clear highlights after animation
            setTimeout(() => {
              leftRailDispatch({ type: 'CLEAR_FIELD_HIGHLIGHTS' });
            }, 1500);
          }

          if (hasStrategies) {
            setStrategies(result.strategies, contextForStrategies);
            setCitations(citations);
            incrementGeneration();
            hasDeliveredStrategies.current = true;

            // Phase transition: strategies arrived
            setPhase('research');
          } else if (phase === 'reflection') {
            // First response with no strategies -> elaboration phase
            setPhase('elaboration');
          }
        } else {
          // User-initiated cancel — remove the message silently, no error banner
          if (result.error.message === 'cancelled') {
            chatDispatch({ type: 'REMOVE_MESSAGE', payload: userMessage.id });
          } else {
          lastFailedMessageRef.current = { id: userMessage.id, content: text };
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
        }
      } finally {
        inFlight.current = false;
      }
    },
    [
      strategies,
      chatState.messages,
      chatState.sessionId,
      leftRailState,
      chatDispatch,
      leftRailDispatch,
      setStrategies,
      setLoading,
      setError,
      phase,
      setPhase,
      setCitations,
      incrementGeneration,
      strategyGeneration,
    ],
  );

  const retry = useCallback(async () => {
    const failed = lastFailedMessageRef.current;
    if (!failed) return;
    // Remove the failed user message so it won't duplicate when send() re-adds it
    chatDispatch({ type: 'REMOVE_MESSAGE', payload: failed.id });
    chatDispatch({ type: 'SET_ERROR', payload: null });
    lastFailedMessageRef.current = null;
    await send(failed.content);
  }, [chatDispatch, send]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { send, retry, cancel, isLoading: chatState.isLoading };
}
