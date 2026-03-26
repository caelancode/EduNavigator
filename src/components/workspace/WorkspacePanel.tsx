import { useEffect, useRef, useState } from 'react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { StrategyCard } from './StrategyCard';
import { WorkspaceEmpty } from './WorkspaceEmpty';
import { WorkspaceLoading } from './WorkspaceLoading';
import { WorkspaceError } from './WorkspaceError';
import { ExportButton } from '../export';

export function WorkspacePanel() {
  const {
    strategies,
    isLoading,
    error,
    selectedIndices,
    toggleSelection,
    setError,
  } = useWorkspace();

  const { state: leftRailState } = useLeftRail();
  const [contextSnapshot, setContextSnapshot] = useState('');
  const isContextStale = strategies.length > 0 && contextSnapshot !== '' && contextSnapshot !== JSON.stringify(leftRailState);

  // Snapshot left rail state when strategies load
  useEffect(() => {
    if (strategies.length > 0) {
      setContextSnapshot(JSON.stringify(leftRailState));
    }
    // Only track when strategies change, not on every left rail update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategies]);

  const [statusAnnouncement, setStatusAnnouncement] = useState('');
  const [showUpdatedBadge, setShowUpdatedBadge] = useState(false);
  const prevCountRef = useRef(strategies.length);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCountRef.current = strategies.length;
      return;
    }
    if (strategies.length > 0) {
      setStatusAnnouncement(`${strategies.length} ${strategies.length === 1 ? 'strategy' : 'strategies'} loaded`);
      setShowUpdatedBadge(true);
      const timer = setTimeout(() => setShowUpdatedBadge(false), 3000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = strategies.length;
  }, [strategies]);

  const statusElement = (
    <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
      {statusAnnouncement}
    </div>
  );

  if (isLoading) {
    return <>{statusElement}<WorkspaceLoading /></>;
  }

  if (error) {
    return (
      <>{statusElement}<WorkspaceError
        code={error.code}
        message={error.message}
        onDismiss={() => setError(null)}
      /></>
    );
  }

  if (strategies.length === 0) {
    return <>{statusElement}<WorkspaceEmpty /></>;
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {statusElement}
      {isContextStale && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          Context changed — click &ldquo;Update Guidance&rdquo; to see new strategies
        </div>
      )}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            Evidence-Based Strategies ({strategies.length})
            {showUpdatedBadge && (
              <span className="animate-pulse rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 motion-reduce:animate-none">
                Updated
              </span>
            )}
          </h2>
          <p className="text-2xs text-neutral-500">Validated strategies from research sources</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIndices.size > 0 && (
            <span className="text-xs text-primary-700">
              {selectedIndices.size} selected
            </span>
          )}
          <ExportButton />
        </div>
      </div>
      <div
        className="space-y-4"
        role="status"
        aria-label={`${strategies.length} strategies loaded`}
      >
        {strategies.map((strategy, index) => (
          <StrategyCard
            key={`${strategy.title}-${index}`}
            strategy={strategy}
            index={index}
            isSelected={selectedIndices.has(index)}
            onToggleSelect={toggleSelection}
          />
        ))}
      </div>
    </div>
  );
}
