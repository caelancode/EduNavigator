import { useState, type ReactNode } from 'react';

interface ThreePanelLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

type PanelId = 'left' | 'center' | 'right';

const tabs: { id: PanelId; label: string }[] = [
  { id: 'left', label: 'Settings' },
  { id: 'center', label: 'Chat' },
  { id: 'right', label: 'Strategies' },
];

export function ThreePanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: ThreePanelLayoutProps) {
  const [activePanel, setActivePanel] = useState<PanelId>('center');

  return (
    <>
      {/* Mobile tab bar */}
      <div
        role="tablist"
        aria-label="Panel navigation"
        className="flex border-b border-neutral-200 lg:hidden"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activePanel === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activePanel === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail */}
        <nav
          id="panel-left"
          role="navigation"
          aria-label="Educator settings"
          className={`w-full flex-shrink-0 overflow-y-auto border-r border-neutral-200 bg-neutral-50 lg:block lg:w-80 ${
            activePanel === 'left' ? 'block' : 'hidden'
          }`}
        >
          {leftPanel}
        </nav>

        {/* Chat */}
        <div
          id="panel-center"
          role="log"
          aria-label="Chat conversation"
          className={`flex min-w-0 flex-1 flex-col overflow-hidden lg:block ${
            activePanel === 'center' ? 'block' : 'hidden'
          }`}
        >
          {centerPanel}
        </div>

        {/* Workspace */}
        <div
          id="panel-right"
          role="region"
          aria-label="Evidence Strategies"
          aria-live="assertive"
          className={`w-full flex-shrink-0 overflow-y-auto border-l border-neutral-200 bg-neutral-50 lg:block lg:w-96 ${
            activePanel === 'right' ? 'block' : 'hidden'
          }`}
        >
          {rightPanel}
        </div>
      </div>
    </>
  );
}
