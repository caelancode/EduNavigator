import { StrategyCardSkeleton } from './StrategyCardSkeleton';

export function WorkspaceLoading() {
  return (
    <div className="h-full overflow-y-auto p-4" role="status">
      <div className="mb-3">
        <div className="h-5 w-32 rounded skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />
      </div>
      <div className="space-y-4">
        <StrategyCardSkeleton />
        <StrategyCardSkeleton />
        <StrategyCardSkeleton />
      </div>
      <span className="sr-only">Finding evidence-based strategies...</span>
    </div>
  );
}
