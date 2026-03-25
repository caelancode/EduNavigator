import { describe, it, expect } from 'vitest';
import { chatReducer, initialChatState } from '../../contexts/ChatContext';
import type { ChatMessage } from '../../types/chat';

const testMessage: ChatMessage = {
  id: 'msg-1',
  role: 'user',
  content: 'Hello',
  timestamp: 1000,
};

describe('chatReducer', () => {
  it('adds a message', () => {
    const state = chatReducer(initialChatState, {
      type: 'ADD_MESSAGE',
      payload: testMessage,
    });
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toBe('Hello');
    expect(state.error).toBeNull();
  });

  it('sets loading', () => {
    const state = chatReducer(initialChatState, {
      type: 'SET_LOADING',
      payload: true,
    });
    expect(state.isLoading).toBe(true);
  });

  it('sets error and clears loading', () => {
    const loadingState = { ...initialChatState, isLoading: true };
    const state = chatReducer(loadingState, {
      type: 'SET_ERROR',
      payload: 'Something went wrong',
    });
    expect(state.error).toBe('Something went wrong');
    expect(state.isLoading).toBe(false);
  });

  it('clears history and generates new session ID', () => {
    const withMessages = {
      ...initialChatState,
      messages: [testMessage],
      error: 'old error',
    };
    const state = chatReducer(withMessages, { type: 'CLEAR_HISTORY' });
    expect(state.messages).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.sessionId).not.toBe(withMessages.sessionId);
  });
});
