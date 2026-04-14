import { type ReactNode, useEffect } from 'react';
import { TopBar } from './TopBar';
import { ThreePanelLayout } from './ThreePanelLayout';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface AppShellProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export function AppShell({
  leftPanel,
  centerPanel,
  rightPanel,
}: AppShellProps) {
  const { strategies } = useWorkspace();

  useEffect(() => {
    if (strategies.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [strategies.length]);

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <TopBar />
      <main
        role="main"
        id="main-content"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <ThreePanelLayout
          leftPanel={leftPanel}
          centerPanel={centerPanel}
          rightPanel={rightPanel}
        />
      </main>
    </div>
  );
}
