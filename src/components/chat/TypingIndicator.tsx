export function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status">
      <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <span className="sr-only">Assistant is typing...</span>
      </div>
    </div>
  );
}
