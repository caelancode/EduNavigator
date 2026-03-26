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
      <footer className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-xs text-neutral-600">
        <p>Strategies are AI-generated and should be reviewed by qualified professionals before implementation. Sources should be verified independently.</p>
        <p className="mt-0.5 text-neutral-500">No personal data is collected or stored. Your inputs are not saved between sessions.</p>
      </footer>
    </div>
  );
}
