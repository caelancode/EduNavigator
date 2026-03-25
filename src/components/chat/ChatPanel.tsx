import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ErrorBanner } from '../ui';

export function ChatPanel() {
  const { state, dispatch } = useChat();

  return (
    <div className="flex h-full flex-col">
      {state.error && (
        <div className="p-4 pb-0">
          <ErrorBanner
            message={state.error}
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        </div>
      )}
      <MessageList />
      <ChatInput />
    </div>
  );
}
