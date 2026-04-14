import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { ChatState, ChatAction, ChatMessage, IntakeStage } from '../types/chat';

function generateSessionId(): string {
  return crypto.randomUUID();
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'What are you working on with this student?',
  timestamp: Date.now(),
  // No nextQuestion here — WelcomeMessage component renders its own support area cards.
  // Adding nextQuestion would create duplicate chips in the chat thread.
};

export const initialChatState: ChatState = {
  messages: [welcomeMessage],
  isLoading: false,
  error: null,
  sessionId: generateSessionId(),
  intakeStage: 'landing',
};

export function chatReducer(
  state: ChatState,
  action: ChatAction,
): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        messages: [{ ...welcomeMessage, timestamp: Date.now() }],
        error: null,
        sessionId: generateSessionId(),
        intakeStage: 'landing',
      };
    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.payload),
      };
    case 'SET_INTAKE_STAGE':
      return { ...state, intakeStage: action.payload as IntakeStage };
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
