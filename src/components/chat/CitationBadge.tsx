import { memo, useCallback, useRef } from 'react';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import type { CitationLink } from '../../types/cross-reference';
import { BADGE_COLORS, BADGE_HOVER_COLORS, BADGE_ACTIVE_COLORS } from '../../constants/badge-colors';

interface CitationBadgeProps {
  citationNumber: number;
  messageId: string;
  /** Whether this citation's generation matches current strategies */
  isActive: boolean;
}

export const CitationBadge = memo(function CitationBadge({
  citationNumber,
  messageId,
  isActive,
}: CitationBadgeProps) {
  const { setActiveCitation, activeCitation, activeCitationInteraction } = useCrossReference();
  const { strategies } = useWorkspace();

  const strategyIndex = citationNumber - 1;
  const badgeColor = BADGE_COLORS[strategyIndex % BADGE_COLORS.length];
  const badgeHover = BADGE_HOVER_COLORS[strategyIndex % BADGE_HOVER_COLORS.length];
  const badgeActive = BADGE_ACTIVE_COLORS[strategyIndex % BADGE_ACTIVE_COLORS.length];
  const strategyTitle =
    isActive && strategies[strategyIndex]
      ? strategies[strategyIndex].title
      : undefined;

  const isCurrentlyActive =
    activeCitation?.citationNumber === citationNumber &&
    activeCitation?.messageId === messageId;

  const citation: CitationLink = {
    citationNumber,
    strategyIndex,
    messageId,
  };

  const clickLockUntil = useRef(0);

  const handleClick = useCallback(() => {
    if (!isActive) return;
    // Suppress hover re-activation for a short window after any click
    clickLockUntil.current = Date.now() + 100;
    // If already active from a click, toggle off. Otherwise, activate as click.
    const shouldClear = isCurrentlyActive && activeCitationInteraction === 'click';
    setActiveCitation(shouldClear ? null : citation, 'click');
  }, [isActive, isCurrentlyActive, activeCitationInteraction, citation, setActiveCitation]);

  const handleMouseEnter = useCallback(() => {
    if (!isActive) return;
    // Skip hover if we just processed a click
    if (Date.now() < clickLockUntil.current) return;
    setActiveCitation(citation, 'hover');
  }, [isActive, citation, setActiveCitation]);

  const handleMouseLeave = useCallback(() => {
    if (!isActive) return;
    setActiveCitation(null);
  }, [isActive, setActiveCitation]);

  if (!isActive) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full bg-neutral-300 px-1.5 text-xs font-bold text-neutral-700"
        title="This reference is from a previous set of strategies"
      >
        {citationNumber}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Reference ${citationNumber}${strategyTitle ? `: ${strategyTitle}` : ''}. Click to show in strategies panel.`}
      title={strategyTitle ?? `Strategy ${citationNumber}`}
      className={`inline-flex h-5 min-w-5 cursor-pointer items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
        isCurrentlyActive
          ? `${badgeActive} text-white shadow-sm`
          : `${badgeColor} text-white ${badgeHover}`
      }`}
    >
      {citationNumber}
    </button>
  );
});
