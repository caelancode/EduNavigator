import { useState, type ReactNode } from 'react';
import { BottomSheet } from './BottomSheet';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface ThreePanelLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export function ThreePanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: ThreePanelLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStrategiesOpen, setIsStrategiesOpen] = useState(false);
  const { strategies } = useWorkspace();

  return (
    <>
      {/* ===== DESKTOP: 3-panel side-by-side (lg+) ===== */}
      <div className="hidden flex-1 overflow-hidden lg:flex">
        {/* Left Rail */}
        <nav
          role="navigation"
          aria-label="Educator settings"
          className="w-64 flex-shrink-0 overflow-y-auto border-r border-neutral-200 bg-rail xl:w-80"
        >
          {leftPanel}
        </nav>

        {/* Chat */}
        <div
          role="log"
          aria-label="Chat conversation"
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          {centerPanel}
        </div>

        {/* Workspace */}
        <div
          role="region"
          aria-label="Evidence Strategies"
          aria-live="polite"
          className="w-80 flex-shrink-0 overflow-y-auto border-l border-neutral-200 bg-neutral-50 xl:w-96"
        >
          {rightPanel}
        </div>
      </div>

      {/* ===== TABLET: Chat + Workspace side by side, Left Rail as bottom sheet (md–lg) ===== */}
      <div className="relative hidden flex-1 overflow-hidden md:flex lg:hidden">
        {/* Chat */}
        <div
          role="log"
          aria-label="Chat conversation"
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          {centerPanel}
        </div>

        {/* Workspace */}
        <div
          role="region"
          aria-label="Evidence Strategies"
          aria-live="polite"
          className="w-72 flex-shrink-0 overflow-y-auto border-l border-neutral-200 bg-neutral-50"
        >
          {rightPanel}
        </div>

        {/* FAB — Open Settings */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="absolute bottom-6 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-colors hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>

        {/* Settings Bottom Sheet */}
        <BottomSheet
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          label="Educator settings"
        >
          <nav role="navigation" aria-label="Educator settings">
            {leftPanel}
          </nav>
        </BottomSheet>
      </div>

      {/* ===== MOBILE: Chat only + bottom sheets (< md) ===== */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:hidden">
        {/* Chat — always visible */}
        <div
          role="log"
          aria-label="Chat conversation"
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          {centerPanel}
        </div>

        {/* FAB — Open Settings */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="absolute bottom-20 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-colors hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>

        {/* Strategies Pill — shows when strategies exist */}
        {strategies.length > 0 && (
          <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-10 flex justify-center">
            <button
              type="button"
              onClick={() => setIsStrategiesOpen(true)}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              View {strategies.length} {strategies.length === 1 ? 'Strategy' : 'Strategies'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Settings Bottom Sheet */}
        <BottomSheet
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          label="Educator settings"
        >
          <nav role="navigation" aria-label="Educator settings">
            {leftPanel}
          </nav>
        </BottomSheet>

        {/* Strategies Bottom Sheet */}
        <BottomSheet
          isOpen={isStrategiesOpen}
          onClose={() => setIsStrategiesOpen(false)}
          label="Evidence Strategies"
        >
          <div role="region" aria-label="Evidence Strategies">
            {rightPanel}
          </div>
        </BottomSheet>
      </div>
    </>
  );
}
