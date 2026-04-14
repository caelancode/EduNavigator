import { useCallback, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DevLoadButton } from './DevLoadButton';

export function TopBar() {
  const { dispatch: chatDispatch } = useChat();
  const { strategies, selectedIndices, setStrategies, setError, clearSelection } = useWorkspace();
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
    if (strategies.length > 0 && selectedIndices.size > 0) {
      setShowConfirm(true);
      return;
    }
    doClear();
  }, [strategies.length, selectedIndices.size, doClear]);

  return (
    <header className="relative flex items-center justify-between bg-gradient-to-r from-primary-800 via-primary-800 to-primary-900 px-6 py-4.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Reload EduNavigator"
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded text-left transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          <h1 className="font-heading text-xl font-bold tracking-wide text-white leading-tight">
            EduNavigator
          </h1>
          <p className="hidden text-xs text-primary-100 sm:block">
            Evidence-Based Strategy Finder
          </p>
        </button>
      </div>

      <div className="flex items-center gap-3">
      <DevLoadButton />
      <button
        type="button"
        onClick={handleNewConversation}
        className="btn-press flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white/90 transition-all hover:border-white/40 hover:text-white active:scale-95 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-800"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Start Over
      </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Start fresh?"
        message="You have bookmarked strategies that will be cleared. Your current conversation and strategies can't be recovered."
        confirmLabel="Start New"
        cancelLabel="Keep Working"
        variant="warning"
        onConfirm={doClear}
        onCancel={() => setShowConfirm(false)}
      />
    </header>
  );
}
