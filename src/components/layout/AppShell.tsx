import { type ReactNode } from 'react';
import { TopBar } from './TopBar';
import { ThreePanelLayout } from './ThreePanelLayout';

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
  return (
    <div className="flex h-screen flex-col">
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
