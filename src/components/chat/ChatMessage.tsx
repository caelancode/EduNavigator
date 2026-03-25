import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { ChatCopyButton } from './ChatCopyButton';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-white text-neutral-800 border border-neutral-200'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        {!isUser && (
          <div className="mt-2 flex justify-end">
            <ChatCopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}
