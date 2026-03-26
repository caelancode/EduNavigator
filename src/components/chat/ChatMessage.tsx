import ReactMarkdown from 'react-markdown';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { ChatCopyButton } from './ChatCopyButton';

function OwlAvatar({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21c-4.97 0-9-4.03-9-9 0-3.5 2.04-6.53 5-8.06.84-.44 1.83-.29 2.53.38l1.47 1.41 1.47-1.41c.7-.67 1.69-.82 2.53-.38 2.96 1.53 5 4.56 5 8.06 0 4.97-4.03 9-9 9z" />
      <circle cx="9" cy="10" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="2" fill="currentColor" stroke="none" />
      <path d="M12 13l-1 2h2l-1-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export { OwlAvatar };

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-6 flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
            <OwlAvatar className="h-4 w-4" />
          </div>
        )}
        <div
          className={`px-5 py-3.5 text-base leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-2xl rounded-tr-sm border border-neutral-200/60 bg-chat-user text-neutral-800'
              : 'rounded-2xl rounded-tl-sm bg-chat-ai text-neutral-800'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:mb-2 prose-headings:mt-3 prose-headings:font-bold prose-headings:text-neutral-800 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          {!isUser && (
            <div className="mt-2 flex justify-end">
              <ChatCopyButton text={message.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
