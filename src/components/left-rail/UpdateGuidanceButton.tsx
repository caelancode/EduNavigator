import { useCallback } from 'react';
import { Button } from '../ui/Button';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { VALUE_LABELS } from '../../constants/system-prompt';
import type { LeftRailState } from '../../types/left-rail';
import type { ChatMessage } from '../../types/chat';

/** Build a human-readable summary of which fields are set in the left rail. */
function buildChangeSummary(state: LeftRailState): string {
  const parts: string[] = [];

  if (state.supportArea) parts.push(VALUE_LABELS[state.supportArea] ?? state.supportArea);
  if (state.subArea) parts.push(VALUE_LABELS[state.subArea] ?? state.subArea);
  if (state.gradeBand) parts.push(VALUE_LABELS[state.gradeBand] ?? state.gradeBand);
  if (state.setting) parts.push(VALUE_LABELS[state.setting] ?? state.setting);
  if (state.grouping) parts.push(VALUE_LABELS[state.grouping] ?? state.grouping);
  if (state.timeRange) parts.push(VALUE_LABELS[state.timeRange] ?? state.timeRange);
  if (state.techContext) parts.push(VALUE_LABELS[state.techContext] ?? state.techContext);
  if (state.outputPreference) parts.push(VALUE_LABELS[state.outputPreference] ?? state.outputPreference);
  if (state.rolePerspective) parts.push(VALUE_LABELS[state.rolePerspective] ?? state.rolePerspective);

  const chars = state.learnerCharacteristics;
  if (chars.communicationLevel.length > 0)
    parts.push(...chars.communicationLevel.map((v) => VALUE_LABELS[v] ?? v));
  if (chars.mobilityLevel.length > 0)
    parts.push(...chars.mobilityLevel.map((v) => VALUE_LABELS[v] ?? v));
  if (chars.sensoryConsiderations.length > 0)
    parts.push(...chars.sensoryConsiderations.map((v) => VALUE_LABELS[v] ?? v));
  if (chars.behavioralConsiderations.length > 0)
    parts.push(...chars.behavioralConsiderations.map((v) => VALUE_LABELS[v] ?? v));

  return parts.join(', ');
}

export function UpdateGuidanceButton() {
  const { state } = useLeftRail();
  const { dispatch: chatDispatch } = useChat();

  const hasAnyContext = state.supportArea !== null || state.gradeBand !== null;

  const handleClick = useCallback(() => {
    const summary = buildChangeSummary(state);

    // A hidden user message signals to all prior messages that the conversation
    // has moved on — this causes their action buttons and chips to become inert.
    const markerMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: 'Updated context.',
      timestamp: Date.now(),
      local: true,
      hidden: true,
    };

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `I see you've updated your context in the sidebar. Here's what I'm working with now:\n\n**${summary}**\n\nWant me to find strategies with this context in mind? You can also type additional details below.`,
      timestamp: Date.now(),
      local: true,
      actionButton: { label: 'Find Strategies' },
    };

    chatDispatch({ type: 'ADD_MESSAGE', payload: markerMessage });
    chatDispatch({ type: 'ADD_MESSAGE', payload: message });
  }, [state, chatDispatch]);

  return (
    <div className="border-t border-neutral-100 bg-surface-50 px-5 py-4">
      <Button
        variant="primary"
        size="lg"
        onClick={handleClick}
        disabled={!hasAnyContext}
        className="w-full"
        aria-label="Update strategies based on sidebar changes"
      >
        Update Context
      </Button>
    </div>
  );
}
