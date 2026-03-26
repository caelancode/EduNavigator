export function ChatSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6" role="status">
      {/* User Message */}
      <div className="flex w-full justify-end">
        <div className="h-10 w-1/3 animate-pulse rounded-2xl rounded-tr-sm bg-neutral-200" />
      </div>

      {/* AI Message 1 */}
      <div className="flex w-full justify-start">
        <div className="flex w-full max-w-[85%] gap-3">
          <div className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-20 w-2/3 animate-pulse rounded-2xl rounded-tl-sm bg-neutral-200" />
        </div>
      </div>

      {/* AI Message 2 */}
      <div className="flex w-full justify-start">
        <div className="flex w-full max-w-[85%] gap-3">
          <div className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-24 w-3/4 animate-pulse rounded-2xl rounded-tl-sm bg-neutral-200" />
        </div>
      </div>

      <span className="sr-only">Loading conversation...</span>
    </div>
  );
}
