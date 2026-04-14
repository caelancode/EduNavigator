import { useState, useEffect, useRef, type ReactNode } from 'react';
import { BottomSheet } from './BottomSheet';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { PanelContext } from '../../contexts/PanelContext';

interface ThreePanelLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

const WORKSPACE_MIN_WIDTH = 280;
const WORKSPACE_MAX_WIDTH = 520;

function getDefaultWorkspaceWidth() {
  const quarter = Math.round(window.innerWidth * 0.25);
  return Math.max(WORKSPACE_MIN_WIDTH, Math.min(WORKSPACE_MAX_WIDTH, quarter));
}

function getStrategiesWorkspaceWidth() {
  const third = Math.round(window.innerWidth * 0.35);
  return Math.max(WORKSPACE_MIN_WIDTH, Math.min(WORKSPACE_MAX_WIDTH, third));
}

export function ThreePanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: ThreePanelLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStrategiesOpen, setIsStrategiesOpen] = useState(false);
  const [workspaceWidth, setWorkspaceWidth] = useState(getDefaultWorkspaceWidth);
  const { strategies } = useWorkspace();
  const { activeCitation } = useCrossReference();
  const { state: leftRailState } = useLeftRail();
  // Wizard mode removed — chat-first UX redesign
  void leftRailState;
  const hasStrategies = strategies.length > 0;
  const prevHadStrategies = useRef(false);

  // Widen workspace when strategies first arrive; reset when cleared.
  useEffect(() => {
    if (hasStrategies && !prevHadStrategies.current) {
      setWorkspaceWidth(getStrategiesWorkspaceWidth());
    } else if (!hasStrategies && prevHadStrategies.current) {
      setWorkspaceWidth(getDefaultWorkspaceWidth());
    }
    prevHadStrategies.current = hasStrategies;
  }, [hasStrategies]);

  // Auto-open strategies sheet/panel when a citation is clicked
  useEffect(() => {
    if (activeCitation) {
      // Mobile: open bottom sheet
      setIsStrategiesOpen(true);
    }
  }, [activeCitation]);

  return (
    <PanelContext.Provider
      value={{
        isLeftRailOpen: true,
        isWorkspaceOpen: true,
        toggleLeftRail: () => {},
        toggleWorkspace: () => {},
      }}
    >
      {/* ===== DESKTOP: 3-panel side-by-side (lg+) ===== */}
      <div className="hidden flex-1 overflow-hidden lg:flex">
        {/* Left Rail */}
        <div className="w-1/4 flex-shrink-0 overflow-hidden">
          <nav
            role="navigation"
            aria-label="Educator settings"
            className="h-full overflow-y-auto border-r panel-divider-left bg-panel-rail custom-scrollbar"
          >
            {leftPanel}
          </nav>
        </div>

        {/* Chat — grows to fill available space, elevated as primary surface */}
        <div
          role="log"
          aria-label="Chat conversation"
          className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-panel-chat shadow-none"
        >
          {centerPanel}
        </div>

        {/* Workspace */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: `${workspaceWidth}px` }}
        >
          <div
            role="region"
            aria-label="Evidence-Based Strategies"
            aria-live="polite"
            className="h-full overflow-y-auto border-l panel-divider-right bg-panel-workspace custom-scrollbar"
          >
            {rightPanel}
          </div>
        </div>
      </div>

      {/* ===== TABLET: Chat + Workspace, Left Rail as bottom sheet (md–lg) ===== */}
      <div className="relative hidden flex-1 overflow-hidden md:flex lg:hidden">
        {/* Chat */}
        <div
          role="log"
          aria-label="Chat conversation"
          className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-panel-chat shadow-none transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          {centerPanel}
        </div>

        {/* Workspace — slides in/out */}
        <div
          className={`relative flex flex-shrink-0 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            hasStrategies ? 'w-80' : 'w-0'
          }`}
        >
          {/* Toggle tab */}
          <button
            type="button"
            onClick={() => setIsStrategiesOpen((prev) => !prev)}
            className="absolute -left-8 top-1/2 z-20 flex h-24 w-8 -translate-y-1/2 items-center justify-center rounded-l-lg border border-r-0 border-neutral-200 bg-surface-50 text-neutral-600 shadow-sm transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md hover:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={isStrategiesOpen ? 'Collapse strategies panel' : 'Expand strategies panel'}
            aria-expanded={isStrategiesOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform duration-300 ${isStrategiesOpen ? 'rotate-0' : 'rotate-180'}`}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {!isStrategiesOpen && hasStrategies && (
              <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {strategies.length}
              </span>
            )}
          </button>

          <div
            role="region"
            aria-label="Evidence-Based Strategies"
            aria-live="polite"
            className={`h-full overflow-y-auto border-l panel-divider-right bg-panel-workspace custom-scrollbar transition-opacity duration-400 ${
              hasStrategies ? 'w-full opacity-100' : 'w-0 overflow-hidden opacity-0'
            }`}
          >
            {rightPanel}
          </div>
        </div>

        {/* FAB — Open Settings (tablet) */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="btn-press absolute bottom-6 left-4 z-10 flex items-center gap-2 rounded-full bg-primary-700 px-4 py-3 text-white shadow-lg transition-colors hover:bg-primary-800 active:scale-95 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span className="text-sm font-medium">Settings</span>
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
        <div className="absolute bottom-20 left-4 z-10 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-colors hover:bg-primary-800 active:scale-95 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Open settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
          <span className="text-[10px] font-medium text-neutral-600" aria-hidden="true">Settings</span>
        </div>

        {/* Strategies Pill — shows when strategies exist */}
        {strategies.length > 0 && (
          <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-10 flex justify-center">
            <button
              type="button"
              onClick={() => setIsStrategiesOpen(true)}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all animate-scale-in motion-reduce:animate-none hover:-translate-y-0.5 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
          label="Evidence-Based Strategies"
        >
          <div role="region" aria-label="Evidence-Based Strategies">
            {rightPanel}
          </div>
        </BottomSheet>
      </div>
    </PanelContext.Provider>
  );
}
