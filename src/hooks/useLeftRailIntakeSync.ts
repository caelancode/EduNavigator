/**
 * useLeftRailIntakeSync
 *
 * Observes left-rail state changes and advances the guided-intake chat flow
 * when the user fills in fields via the sidebar instead of through the chat.
 *
 * IMPORTANT: This hook must be called exactly once in the component tree
 * (currently in ChatPanel). The observer effect must not be inside
 * useGuidedIntake, which is called by multiple mounted components.
 */
import { useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useLeftRail } from '../contexts/LeftRailContext';
import { SUPPORT_AREA_OPTIONS, SUB_AREA_OPTIONS, GRADE_BAND_OPTIONS } from '../constants/left-rail-options';
import { VALUE_LABELS } from '../constants/system-prompt';
import type { ChatMessage } from '../types/chat';

// Module-level guards — shared across all hook instances and component renders.
// Set by useGuidedIntake before it dispatches to the left rail, so the observer
// here ignores values that the chat flow itself wrote.
let _syncedSupportArea: string | null = null;
let _syncedSubArea: string | null = null;
let _syncedGradeBand: string | null = null;

/** Called by useGuidedIntake before it dispatches SET_SUPPORT_AREA. */
export function markSupportAreaSynced(value: string): void {
  _syncedSupportArea = value;
}

/** Called by useGuidedIntake before it dispatches SET_SUB_AREA. */
export function markSubAreaSynced(value: string): void {
  _syncedSubArea = value;
}

/** Called by useGuidedIntake before it dispatches SET_GRADE_BAND. */
export function markGradeBandSynced(value: string): void {
  _syncedGradeBand = value;
}

/** Reset guards when a session is cleared. */
export function resetSyncGuards(): void {
  _syncedSupportArea = null;
  _syncedSubArea = null;
  _syncedGradeBand = null;
}

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

export function useLeftRailIntakeSync(): void {
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { state: leftRailState } = useLeftRail();

  // Reset guards when the session clears back to 'landing'.
  useEffect(() => {
    if (chatState.intakeStage === 'landing') {
      resetSyncGuards();
    }
  }, [chatState.intakeStage]);

  // Observer: react to left-rail changes that happen outside the guided chat flow.
  useEffect(() => {
    const { supportArea, subArea, gradeBand } = leftRailState;
    const currentStage = chatState.intakeStage;

    if (currentStage === 'complete') return;

    // TC1: supportArea set from the sidebar while chat is still at the welcome screen.
    if (
      currentStage === 'landing' &&
      supportArea !== null &&
      supportArea !== _syncedSupportArea
    ) {
      _syncedSupportArea = supportArea;
      const label =
        SUPPORT_AREA_OPTIONS.find((o) => o.value === supportArea)?.label ??
        supportArea;
      const subAreas = SUB_AREA_OPTIONS[supportArea] ?? [];
      const subAreaValues = subAreas.map((o) => o.value);

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(label),
      });
      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalAssistantMessage(
          `Got it — I've noted **${label}** from the sidebar. What's the main focus?`,
          {
            nextQuestion: {
              field: 'subArea',
              text: "What's the main focus?",
              options: subAreaValues,
              isLocal: true,
            },
          },
        ),
      });
      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'sub_area' });
      return;
    }

    // TC2: subArea set from the sidebar while chat is showing the sub-area question.
    if (
      currentStage === 'sub_area' &&
      subArea !== null &&
      subArea !== _syncedSubArea
    ) {
      _syncedSubArea = subArea;
      const label = VALUE_LABELS[subArea] ?? subArea;

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(label),
      });

      if (gradeBand !== null) {
        // Grade band already set — skip to confirm.
        const gradeLabel = VALUE_LABELS[gradeBand] ?? gradeBand;
        const supportLabel = VALUE_LABELS[supportArea ?? ''] ?? supportArea ?? '';
        const contextSummary = [supportLabel, label, gradeLabel].filter(Boolean).join(' · ');
        const confirmContent = `Here's what I'll be working with:\n**${contextSummary}**\n\nWant me to find strategies based on this, or is there more about the student or situation that would help? You can type below, or use the sidebar to add details like grouping, setting, or learner characteristics. The more context I have, the more targeted the advice.`;
        chatDispatch({
          type: 'ADD_MESSAGE',
          payload: makeLocalAssistantMessage(confirmContent, {
            actionButton: { label: 'Find Strategies' },
          }),
        });
        chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'confirm' });
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
      return;
    }

    // gradeBand set from the sidebar while the chat is showing grade band chips.
    if (
      currentStage === 'grade_band' &&
      gradeBand !== null &&
      gradeBand !== _syncedGradeBand
    ) {
      _syncedGradeBand = gradeBand;
      const gradeLabel = VALUE_LABELS[gradeBand] ?? gradeBand;
      const supportLabel = VALUE_LABELS[supportArea ?? ''] ?? supportArea ?? '';
      const subAreaLabel = VALUE_LABELS[subArea ?? ''] ?? subArea ?? '';
      const contextSummary = [supportLabel, subAreaLabel, gradeLabel]
        .filter(Boolean)
        .join(' · ');
      const confirmContent = `Here's what I'll be working with:\n**${contextSummary}**\n\nWant me to find strategies based on this, or is there more about the student or situation that would help? You can type below, or use the sidebar to add details like grouping, setting, or learner characteristics. The more context I have, the more targeted the advice.`;

      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalUserMessage(gradeLabel),
      });
      chatDispatch({
        type: 'ADD_MESSAGE',
        payload: makeLocalAssistantMessage(confirmContent, {
          actionButton: { label: 'Find Strategies' },
        }),
      });
      chatDispatch({ type: 'SET_INTAKE_STAGE', payload: 'confirm' });
      return;
    }
  }, [
    leftRailState.supportArea,
    leftRailState.subArea,
    leftRailState.gradeBand,
    chatState.intakeStage,
    chatDispatch,
  ]);
}
