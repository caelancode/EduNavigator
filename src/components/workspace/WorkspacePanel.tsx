import { useWorkspace } from '../../contexts/WorkspaceContext';
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

  if (isLoading) {
    return <WorkspaceLoading />;
  }

  if (error) {
    return (
      <WorkspaceError
        code={error.code}
        message={error.message}
        onDismiss={() => setError(null)}
      />
    );
  }

  if (strategies.length === 0) {
    return <WorkspaceEmpty />;
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700">
          Strategies ({strategies.length})
        </h2>
        <div className="flex items-center gap-3">
          {selectedIndices.size > 0 && (
            <span className="text-xs text-primary-600">
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
