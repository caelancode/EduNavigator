import { OwlAvatar } from './ChatMessage';

export function TypingIndicator() {
  return (
    <div className="mb-6 flex w-full justify-start" role="status">
      <div className="flex max-w-[85%] flex-row gap-3">
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
          <OwlAvatar className="h-4 w-4" />
        </div>
        <div className="flex h-[52px] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-chat-ai px-5 py-4 shadow-sm">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-500 motion-reduce:animate-none"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-500 motion-reduce:animate-none"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary-500 motion-reduce:animate-none"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
      <span className="sr-only">Assistant is typing...</span>
    </div>
  );
}
