import { useEffect, useRef, useState, useCallback } from 'react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { StrategyCard } from './StrategyCard';
import { WorkspaceEmpty } from './WorkspaceEmpty';
import { WorkspaceLoading } from './WorkspaceLoading';
import { WorkspaceError } from './WorkspaceError';
import { ExportButton } from '../export';
import type { Strategy } from '../../types/strategy';

export function WorkspacePanel() {
  const {
    strategyGroups,
    strategies,
    contextAtGeneration,
    isLoading,
    error,
    selectedIndices,
    setError,
  } = useWorkspace();

  const { state: leftRailState } = useLeftRail();
  const { state: chatState } = useChat();
  const hasMessages = chatState.messages.length > 0;
  const { activeCitation, activeCitationInteraction, strategyCardRefs, setActiveCitation } =
    useCrossReference();
  const [citationAnnouncement, setCitationAnnouncement] = useState('');
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Accordion toggle — only one card open at a time
  const handleToggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  // Toggle expand when a citation badge is clicked in chat
  useEffect(() => {
    if (activeCitationInteraction === 'click') {
      if (activeCitation) {
        setExpandedIndex((prev) =>
          prev === activeCitation.strategyIndex ? null : activeCitation.strategyIndex
        );
      } else {
        setExpandedIndex(null);
      }
    }
  }, [activeCitation, activeCitationInteraction]);

  // Scroll to and highlight the cited strategy card
  useEffect(() => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    if (activeCitation) {
      const el = strategyCardRefs.current.get(activeCitation.strategyIndex);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const title = strategies[activeCitation.strategyIndex]?.title;
        if (title) {
          setCitationAnnouncement(`Showing strategy: ${title}`);
        }
      }

      // Auto-clear highlight after 3 seconds
      highlightTimeoutRef.current = setTimeout(() => {
        setActiveCitation(null);
        setCitationAnnouncement('');
      }, 3000);
    } else {
      setCitationAnnouncement('');
    }

    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [activeCitation, strategyCardRefs, strategies, setActiveCitation]);

  const isContextStale =
    strategies.length > 0 &&
    contextAtGeneration !== null &&
    JSON.stringify(contextAtGeneration) !== JSON.stringify(leftRailState);

  const [statusAnnouncement, setStatusAnnouncement] = useState('');
  const [showArrivalFlash, setShowArrivalFlash] = useState(false);
  const prevCountRef = useRef(strategies.length);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCountRef.current = strategies.length;
      return;
    }
    if (strategies.length > prevCountRef.current) {
      const added = strategies.length - prevCountRef.current;
      setStatusAnnouncement(`${added} ${added === 1 ? 'strategy' : 'strategies'} added`);
      // Flash border when new strategies arrive
      setShowArrivalFlash(true);
      const timer = setTimeout(() => setShowArrivalFlash(false), 1000);
      prevCountRef.current = strategies.length;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = strategies.length;
  }, [strategies]);

  const handleWorkspaceInteraction = useCallback(() => {}, []);

  const statusElement = (
    <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
      {statusAnnouncement}
    </div>
  );

  const citationAnnouncementElement = (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {citationAnnouncement}
    </div>
  );

  // Precompute global index offsets for each group so StrategyCard gets the
  // correct flat index into the workspace array
  const groupsWithOffsets = strategyGroups.reduce<
    { group: (typeof strategyGroups)[0]; offset: number }[]
  >((acc, group) => {
    const offset = acc.length === 0 ? 0 : acc[acc.length - 1].offset + acc[acc.length - 1].group.strategies.length;
    return [...acc, { group, offset }];
  }, []);

  return (
    <div className="flex h-full flex-col">
      {statusElement}
      {citationAnnouncementElement}

      {/* Panel header */}
      <div className="border-b border-neutral-200 bg-neutral-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold tracking-tight text-neutral-800">
            Evidence-Based Strategies
            {strategies.length > 0 && (
              <span className="ml-1.5 font-medium text-neutral-500">
                ({strategies.length})
              </span>
            )}
          </h2>
          {strategies.length > 0 && <ExportButton />}
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {strategies.length > 0
            ? 'Matched to your current teaching context'
            : hasMessages
              ? 'Strategies will appear here as the conversation develops.'
              : 'Strategies will appear here once you start chatting.'}
        </p>
      </div>

      {/* Content area */}
      {isLoading && strategies.length === 0 ? (
        <WorkspaceLoading />
      ) : strategies.length === 0 && error ? (
        <WorkspaceError
          code={error.code}
          message={error.message}
          onDismiss={() => setError(null)}
        />
      ) : strategies.length === 0 ? (
        <WorkspaceEmpty />
      ) : (
        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-5"
          role="presentation"
          onClick={handleWorkspaceInteraction}
          onScroll={handleWorkspaceInteraction}
        >
          {/* Inline error banner when strategies already exist — preserves card visibility */}
          {error && (
            <div className="mb-4">
              <WorkspaceError
                code={error.code}
                message={error.message}
                onDismiss={() => setError(null)}
              />
            </div>
          )}
          {isContextStale && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800 shadow-card animate-fade-in-up motion-reduce:animate-none">
              <svg className="mt-0.5 h-5 w-5 shrink-0 animate-pulse motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              <div>
                <p className="font-semibold">Your settings have changed</p>
                <p className="mt-0.5 text-accent-700">Send a new message or click &ldquo;Update Context&rdquo; in the settings panel to refresh.</p>
              </div>
            </div>
          )}
          <div
            className={`space-y-4 ${showArrivalFlash ? 'rounded-2xl animate-border-flash motion-reduce:animate-none' : ''}`}
            role="status"
            aria-label={`${strategies.length} strategies loaded`}
          >
            {groupsWithOffsets.map(({ group, offset }, groupIndex) => (
              <div key={group.turnNumber}>
                {/* Turn divider — only shown from the second group onwards */}
                {groupIndex > 0 && (
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className="flex-1 border-t border-neutral-200" />
                    <span className="text-sm font-medium text-neutral-400 shrink-0">
                      Round {group.turnNumber}
                    </span>
                    <div className="flex-1 border-t border-neutral-200" />
                  </div>
                )}
                <div className="space-y-4">
                  {group.strategies.map((strategy, stratIndex) => {
                    const globalIndex = offset + stratIndex;
                    return (
                      <StrategyCard
                        key={`${groupIndex}-${stratIndex}`}
                        strategy={strategy}
                        index={globalIndex}
                        isExpanded={expandedIndex === globalIndex}
                        onToggleExpand={handleToggleExpand}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator for subsequent rounds */}
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 animate-fade-in-up motion-reduce:animate-none" role="status">
              <svg className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              <span>Finding more strategies…</span>
            </div>
          )}

          {/* Copy all */}
          <div className="mt-6 border-t border-neutral-200 pt-4">
            <CopyAllButton strategies={strategies} selectedIndices={selectedIndices} />
          </div>
        </div>
      )}
    </div>
  );
}

function CopyAllButton({ strategies, selectedIndices }: { strategies: Strategy[]; selectedIndices: Set<number> }) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = useCallback(async () => {
    const items = selectedIndices.size > 0
      ? strategies.filter((_, i) => selectedIndices.has(i))
      : strategies;

    const text = items.map((s, i) => {
      const lines: string[] = [`Strategy ${i + 1}: ${s.title}`, ''];
      if (s.context_tagline) lines.push(`Context: ${s.context_tagline}`, '');
      lines.push('Quick Version:', s.quick_version, '');
      if (s.steps) {
        if (s.steps.prep.length > 0) {
          lines.push('Prep:');
          s.steps.prep.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
        if (s.steps.during.length > 0) {
          lines.push('During:');
          s.steps.during.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
        if (s.steps.follow_up.length > 0) {
          lines.push('Follow-Up:');
          s.steps.follow_up.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
      } else if (s.how_to) {
        lines.push('How to Implement:', s.how_to, '');
      }
      lines.push('Why This Works:', s.why_fits, '', `"${s.supporting_excerpt}"`, `— ${s.source.formatted || s.source_ref}`);
      return lines.join('\n');
    }).join('\n\n---\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, [strategies, selectedIndices]);

  return (
    <button
      type="button"
      onClick={handleCopyAll}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${copied ? 'border-success-500 bg-success-50 text-success-800' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 animate-scale-in motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          Copy All Strategies
        </>
      )}
    </button>
  );
}
