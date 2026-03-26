import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../contexts/AppProvider';
import { ChatPanel } from '../../components/chat';

function renderChatPanel() {
  return render(
    <AppProvider>
      <ChatPanel />
    </AppProvider>,
  );
}

describe('ChatPanel', () => {
  it('renders the welcome message', () => {
    renderChatPanel();
    expect(
      screen.getByText(/welcome to edunavigator/i),
    ).toBeInTheDocument();
  });

  it('renders suggestion chips in welcome state', () => {
    renderChatPanel();
    expect(
      screen.getByRole('button', { name: /reading strategies/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sensory cooldown/i }),
    ).toBeInTheDocument();
  });

  it('renders the chat input', () => {
    renderChatPanel();
    expect(screen.getByLabelText(/chat message input/i)).toBeInTheDocument();
  });

  it('renders the send button', () => {
    renderChatPanel();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    renderChatPanel();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });
});
