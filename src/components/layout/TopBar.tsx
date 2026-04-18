import { useCallback, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DevLoadButton } from './DevLoadButton';

export function TopBar() {
  const { state: chatState, dispatch: chatDispatch } = useChat();
  const { strategies, setStrategies, setError, clearSelection } = useWorkspace();
  const { dispatch: leftRailDispatch } = useLeftRail();
  const [showConfirm, setShowConfirm] = useState(false);

  const doClear = useCallback(() => {
    chatDispatch({ type: 'CLEAR_HISTORY' });
    leftRailDispatch({ type: 'RESET' });
    setStrategies([]);
    setError(null);
    clearSelection();
    setShowConfirm(false);
  }, [chatDispatch, leftRailDispatch, setStrategies, setError, clearSelection]);

  const handleNewConversation = useCallback(() => {
    const hasProgress = chatState.messages.length > 0 || strategies.length > 0;
    if (hasProgress) {
      setShowConfirm(true);
      return;
    }
    doClear();
  }, [chatState.messages.length, strategies.length, doClear]);

  return (
    <header className="relative flex items-center justify-between bg-gradient-to-r from-primary-800 via-primary-800 to-primary-900 px-4 py-2 lg:px-6 lg:py-2.5">
      {/* Logo */}
      <button
        type="button"
        aria-label="Reload EduNavigator"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 cursor-pointer rounded text-left transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
      >
        <svg
          className="h-4 w-4 flex-shrink-0 text-primary-300 lg:h-5 lg:w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <h1 className="font-heading text-sm font-bold tracking-wide text-white leading-tight lg:text-xl">
          EduNavigator
        </h1>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dev Mock — desktop only */}
        <div className="hidden lg:flex">
          <DevLoadButton />
        </div>

        {/* Start Over — icon-only below lg, icon+text on desktop */}
        <button
          type="button"
          onClick={handleNewConversation}
          aria-label="Start over"
          className="btn-press flex items-center gap-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800
            text-white/70 hover:text-white/95
            p-1.5 lg:border lg:border-white/25 lg:px-4 lg:py-2 lg:text-sm lg:font-semibold lg:text-white/90 lg:hover:border-white/40"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span className="hidden lg:inline">Start Over</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Start fresh?"
        message="Your current conversation and context will be cleared. This can't be undone."
        confirmLabel="Start Over"
        cancelLabel="Keep Going"
        variant="warning"
        onConfirm={doClear}
        onCancel={() => setShowConfirm(false)}
      />
    </header>
  );
}
