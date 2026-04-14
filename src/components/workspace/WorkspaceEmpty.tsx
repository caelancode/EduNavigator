function PlaceholderCard({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 py-5 pl-8 pr-6"
      aria-hidden="true"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-neutral-300 text-sm font-bold text-neutral-400">
        {index + 1}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-3/4 rounded-full bg-neutral-200" />
        <div className="h-3 w-1/2 rounded-full bg-neutral-200" />
      </div>
    </div>
  );
}

export function WorkspaceEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
      {/* Placeholder strategy card slots */}
      <div className="mb-8 flex w-full max-w-lg flex-col gap-3">
        <PlaceholderCard index={0} />
        <PlaceholderCard index={1} />
        <PlaceholderCard index={2} />
      </div>

    </div>
  );
}
