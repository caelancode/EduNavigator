import { useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useLeftRail } from '../contexts/LeftRailContext';
import { useSendMessage } from './useSendMessage';
import { getLabelForFieldValue } from '../utils/field-options';
import {
  SUB_AREA_OPTIONS,
  GRADE_BAND_OPTIONS,
  SUPPORT_AREA_OPTIONS,
} from '../constants/left-rail-options';

import { markSupportAreaSynced, markSubAreaSynced, markGradeBandSynced } from './useLeftRailIntakeSync';
import type { GradeBand } from '../types/left-rail';
import type { IntakeStage, ChatMessage } from '../types/chat';

export type { IntakeStage };

function makeLocalAssistantMessage(
  content: string,
  extras?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    timestamp: Date.now(),
    local: true,
    ...extras,
  };
}

function makeLocalUserMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    timestamp: Date.now(),
    local: true,
  };
}


export function useGuidedIntake() {
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { state: leftRailState, dispatch: leftRailDispatch } = useLeftRail();
  const { send } = useSendMessage();

  const stage = chatState.intakeStage;

  const selectSupportArea = useCallback(
    (value: string) => {
      const label =
        SUPPORT_AREA_OPTIONS.find((o) => o.value === value)?.label ?? value;

      // Mark before dispatching so the observer in useLeftRailIntakeSync ignores this change.
      markSupportAreaSynced(value);
      leftRailDispatch({ type: 'SET_SUPPORT_AREA', payload: value });

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(label),
      });

      const subAreas = SUB_AREA_OPTIONS[value] ?? [];
      const subAreaValues = subAreas.map((o) => o.value);

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalAssistantMessage("What's the main focus?", {
          nextQuestion: {
            field: 'subArea',
            text: "What's the main focus?",
            options: subAreaValues,
            isLocal: true,
          },
        }),
      });

      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'sub_area' });
    },
    [chatDispatch, leftRailDispatch],
  );

  const selectSubArea = useCallback(
    (value: string) => {
      const label = getLabelForFieldValue('subArea', value);

      markSubAreaSynced(value);
      leftRailDispatch({ type: 'SET_SUB_AREA', payload: value });

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(label),
      });

      // If user selected "Other", ask for elaboration before proceeding.
      if (value === 'other') {
        chatDispatch({
          type: 'ADD_MESSAGE',
          payload: makeLocalAssistantMessage(
            "Got it! Can you describe what you're working on? For example, are you thinking about something like staff coordination, the IEP process, working with families, or something else entirely?",
          ),
        });
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'other_elaboration' });
        return;
      }

      if (leftRailState.gradeBand) {
        // Grade band already known — fire API immediately.
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'complete' });
        send('Find evidence-based strategies for my current context.', {
          hidden: true,
          contextOverrides: { subArea: value },
        });
      } else {
        // Normal flow: ask for grade band.
        const gradeBandValues = GRADE_BAND_OPTIONS.map((o) => o.value);
        chatDispatch({
          type: 'ADD_MESSAGE',
          payload: makeLocalAssistantMessage('And what grade or age band?', {
            nextQuestion: {
              field: 'gradeBand',
              text: 'And what grade or age band?',
              options: gradeBandValues,
              isLocal: true,
            },
          }),
        });
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'grade_band' });
      }
    },
    [
      chatDispatch,
      leftRailDispatch,
      leftRailState.gradeBand,
      send,
    ],
  );

  const elaborateOther = useCallback(
    (text: string) => {
      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(text),
      });

      if (leftRailState.gradeBand) {
        // Grade band already known — fire API immediately.
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'complete' });
        send('Find evidence-based strategies for my current context.', { hidden: true });
      } else {
        const gradeBandValues = GRADE_BAND_OPTIONS.map((o) => o.value);
        chatDispatch({
          type: 'ADD_MESSAGE',
          payload: makeLocalAssistantMessage('And what grade or age band?', {
            nextQuestion: {
              field: 'gradeBand',
              text: 'And what grade or age band?',
              options: gradeBandValues,
              isLocal: true,
            },
          }),
        });
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'grade_band' });
      }
    },
    [chatDispatch, leftRailState.gradeBand, send],
  );

  const selectGradeBand = useCallback(
    (value: string) => {
      const label = getLabelForFieldValue('gradeBand', value);

      // Mark before dispatching so the observer in useLeftRailIntakeSync ignores this change.
      markGradeBandSynced(value);
      leftRailDispatch({
        type: 'SET_GRADE_BAND',
        payload: value as GradeBand,
      });

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(label),
      });

      // Skip the confirm stage — fire the API immediately and let the
      // readiness barometer in the system prompt decide what to do.
      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'complete' });
      send('Find evidence-based strategies for my current context.', {
        hidden: true,
        contextOverrides: { gradeBand: value as GradeBand },
      });
    },
    [chatDispatch, leftRailDispatch, send],
  );

  const confirmAndSearch = useCallback(
    (extraMessage?: string) => {
      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'complete' });

      const message =
        extraMessage ??
        'Find evidence-based strategies for my current context.';

      send(message, { hidden: !extraMessage });
    },
    [chatDispatch, send],
  );

  const skipToApi = useCallback(
    (message: string) => {
      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'complete' });
      send(message);
    },
    [chatDispatch, send],
  );

  return {
    stage,
    selectSupportArea,
    selectSubArea,
    elaborateOther,
    selectGradeBand,
    confirmAndSearch,
    skipToApi,
  };
}
