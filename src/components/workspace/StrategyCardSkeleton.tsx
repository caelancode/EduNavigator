export function StrategyCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />
        <div className="h-6 w-3/4 rounded skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />
      </div>

      <div className="h-24 w-full rounded-xl skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />

      <div className="h-32 w-full rounded-xl skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />

      <div className="mt-2 flex flex-col gap-3">
        <div className="h-16 w-full rounded-r-lg border-l-4 border-neutral-300 skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />
        <div className="ml-4 h-4 w-1/3 rounded skeleton-shimmer motion-reduce:bg-neutral-200 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
