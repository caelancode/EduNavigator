import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ReadyForStrategiesButton } from './ReadyForStrategiesButton';
import { useChat } from '../../contexts/ChatContext';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useLeftRailIntakeSync } from '../../hooks/useLeftRailIntakeSync';
import { ErrorBanner } from '../ui';

export function ChatPanel() {
  const { state, dispatch } = useChat();
  const { send, retry } = useSendMessage();
  useLeftRailIntakeSync(send);

  return (
    <div className="flex h-full flex-col">
      {state.error && (
        <div className="p-4 pb-0">
          <ErrorBanner
            message={state.error}
            onRetry={retry}
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        </div>
      )}
      <MessageList />
      <ReadyForStrategiesButton />
      <ChatInput />
    </div>
  );
}
