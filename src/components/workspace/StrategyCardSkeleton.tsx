export function StrategyCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface-50 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 shrink-0 animate-pulse motion-reduce:animate-none rounded-full bg-neutral-200" />
        <div className="h-6 w-3/4 animate-pulse motion-reduce:animate-none rounded bg-neutral-200" />
      </div>

      <div className="h-24 w-full animate-pulse motion-reduce:animate-none rounded-xl bg-neutral-200" />

      <div className="h-32 w-full animate-pulse motion-reduce:animate-none rounded-xl bg-neutral-200" />

      <div className="mt-2 flex flex-col gap-3">
        <div className="h-16 w-full animate-pulse motion-reduce:animate-none rounded-r-lg border-l-4 border-neutral-300 bg-neutral-200" />
        <div className="ml-4 h-4 w-1/3 animate-pulse motion-reduce:animate-none rounded bg-neutral-200" />
      </div>
    </div>
  );
}
