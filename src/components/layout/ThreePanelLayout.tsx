import { useState, useEffect, useRef, type ReactNode } from 'react';
import { MobileNavBar } from './MobileNavBar';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { PanelContext } from '../../contexts/PanelContext';
import { ExportButton } from '../export';
import { UpdateGuidanceButton } from '../left-rail/UpdateGuidanceButton';
import { ChatInput } from '../chat/ChatInput';
import { CopyAllButton } from '../workspace/CopyAllButton';

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
  const [activeTab, setActiveTab] = useState<'left' | 'chat' | 'workspace'>('chat');
  const [workspaceWidth, setWorkspaceWidth] = useState(getDefaultWorkspaceWidth);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);
  const { strategies } = useWorkspace();
  const { activeCitation } = useCrossReference();
  const { state: leftRailState } = useLeftRail();
  // Wizard mode removed — chat-first UX redesign
  void leftRailState;
  const hasStrategies = strategies.length > 0;
  const prevHadStrategies = useRef(false);

  // Widen workspace when strategies first arrive; reset when cleared.
  // On mobile, auto-switch to the Strategies tab when results first appear.
  useEffect(() => {
    if (hasStrategies && !prevHadStrategies.current) {
      setWorkspaceWidth(getStrategiesWorkspaceWidth());
      setActiveTab('workspace');
    } else if (!hasStrategies && prevHadStrategies.current) {
      setWorkspaceWidth(getDefaultWorkspaceWidth());
    }
    prevHadStrategies.current = hasStrategies;
  }, [hasStrategies]);

  // Switch to workspace tab when a citation is clicked
  useEffect(() => {
    if (activeCitation) {
      setActiveTab('workspace');
    }
  }, [activeCitation]);

  function handleDividerPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = workspaceWidth;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDividerPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const delta = dragStartXRef.current - e.clientX;
    // Left rail is 25% of viewport; workspace max = half of remaining space (equal to chat)
    const availableWidth = window.innerWidth * 0.75;
    const dynamicMax = Math.round(availableWidth / 2);
    const newWidth = Math.max(
      WORKSPACE_MIN_WIDTH,
      Math.min(dynamicMax, dragStartWidthRef.current + delta),
    );
    setWorkspaceWidth(newWidth);
  }

  function handleDividerPointerUp() {
    isDraggingRef.current = false;
  }

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
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        {/* Shared header bar — one physical element so headers can never misalign at any zoom level */}
        <div className="flex flex-shrink-0 border-b border-neutral-300 bg-neutral-100">
          {/* Left rail title — matches w-1/4 column */}
          <div className="w-1/4 flex-shrink-0 border-r border-neutral-300 px-5 py-4">
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading text-sm font-bold tracking-tight text-neutral-800">
                Your Teaching Context
              </h2>
              <div className="group relative">
                <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-neutral-400 text-[10px] font-bold leading-none text-neutral-400 select-none">i</span>
                <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-64 rounded-md bg-neutral-800 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  A structured snapshot of your teaching context — built through the conversation and editable at any time
                </div>
              </div>
            </div>
          </div>
          {/* Chat title — matches flex-1 column */}
          <div className="min-w-0 flex-1 px-5 py-4">
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading text-sm font-bold tracking-tight text-neutral-800">
                Conversation
              </h2>
              <div className="group relative">
                <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-neutral-400 text-[10px] font-bold leading-none text-neutral-400 select-none">i</span>
                <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-72 rounded-md bg-neutral-800 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  The primary space to describe your scenario and work through guided questions that shape your strategy recommendations
                </div>
              </div>
            </div>
          </div>
          {/* Spacer matching the draggable resize handle width */}
          <div className="w-3 flex-shrink-0 border-x border-neutral-300 bg-neutral-100" aria-hidden="true" />
          {/* Workspace title — matches dynamic workspace column */}
          <div
            className="flex-shrink-0 px-5 py-4"
            style={{ width: `${workspaceWidth}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-heading text-sm font-bold tracking-tight text-neutral-800">
                  Evidence-Based Strategies
                  {strategies.length > 0 && (
                    <span className="ml-1.5 font-medium text-neutral-600">
                      ({strategies.length})
                    </span>
                  )}
                </h2>
                <div className="group relative">
                  <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-neutral-400 text-[10px] font-bold leading-none text-neutral-400 select-none">i</span>
                  <div className="pointer-events-none absolute right-0 top-full z-50 mt-1.5 w-72 rounded-md bg-neutral-800 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    A curated selection of evidence-based strategies, tailored to the teaching context you&apos;ve built through the conversation
                  </div>
                </div>
              </div>
              {strategies.length > 0 && <ExportButton />}
            </div>
          </div>
        </div>

        {/* Three panel columns */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Rail */}
          <div className="w-1/4 flex-shrink-0 overflow-hidden">
            <nav
              role="navigation"
              aria-label="Educator settings"
              className="h-full overflow-y-auto border-r border-neutral-300 bg-panel-rail custom-scrollbar"
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

          {/* Draggable resize handle — chat | workspace */}
          <div
            role="separator"
            aria-label="Resize chat and strategies panels"
            aria-orientation="vertical"
            className="group relative z-20 flex w-3 flex-shrink-0 cursor-col-resize items-center justify-center select-none border-x border-neutral-300 bg-neutral-100 transition-colors duration-150 hover:border-primary-200 hover:bg-primary-50"
            onPointerDown={handleDividerPointerDown}
            onPointerMove={handleDividerPointerMove}
            onPointerUp={handleDividerPointerUp}
          >
            {/* Three-dot grip indicator */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-neutral-400 transition-colors duration-150 group-hover:bg-primary-500" />
              <div className="h-1 w-1 rounded-full bg-neutral-400 transition-colors duration-150 group-hover:bg-primary-500" />
              <div className="h-1 w-1 rounded-full bg-neutral-400 transition-colors duration-150 group-hover:bg-primary-500" />
            </div>
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
              className="h-full overflow-y-auto bg-panel-workspace custom-scrollbar"
            >
              {rightPanel}
            </div>
          </div>
        </div>

        {/* Shared footer bar — one physical element so footers can never misalign at any zoom level */}
        <div className="flex flex-shrink-0">
          {/* Left section — matches w-1/4 column */}
          <div className="w-1/4 flex-shrink-0 border-r border-neutral-300">
            <UpdateGuidanceButton />
          </div>
          {/* Chat section — matches flex-1 column */}
          <div className="min-w-0 flex-1 border-t border-neutral-300 flex flex-col justify-center">
            <ChatInput />
          </div>
          {/* Spacer matching the draggable resize handle width */}
          <div className="w-3 flex-shrink-0 border-x border-t border-neutral-300 bg-neutral-100" aria-hidden="true" />
          {/* Workspace section — Copy All + disclaimer */}
          <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3" style={{ width: `${workspaceWidth}px` }}>
            {hasStrategies && (
              <>
                <CopyAllButton />
                <p className="min-w-0 text-xs text-neutral-400">
                  AI-generated strategies should be reviewed by qualified professionals. No personal data is collected.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE: Three-tab layout (< lg) ===== */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {/* Animated tab bar */}
        <MobileNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          strategyCount={strategies.length}
        />

        {/* Panel content area — all three panels rendered, only active one visible */}
        <div className="relative flex-1 overflow-hidden">
          {/* Context (Left Rail) */}
          <div
            id="panel-left"
            role="region"
            aria-label="Teaching context settings"
            aria-hidden={activeTab !== 'left'}
            className={`absolute inset-0 overflow-y-auto bg-panel-rail custom-scrollbar transition-opacity duration-200 ${
              activeTab === 'left'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <nav role="navigation" aria-label="Educator settings">
              {leftPanel}
            </nav>
          </div>

          {/* Conversation (Chat) */}
          <div
            id="panel-chat"
            role="log"
            aria-label="Chat conversation"
            aria-hidden={activeTab !== 'chat'}
            className={`absolute inset-0 flex flex-col overflow-hidden bg-panel-chat transition-opacity duration-200 ${
              activeTab === 'chat'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {centerPanel}
          </div>

          {/* Strategies (Workspace) */}
          <div
            id="panel-workspace"
            role="region"
            aria-label="Evidence-Based Strategies"
            aria-live="polite"
            aria-hidden={activeTab !== 'workspace'}
            className={`absolute inset-0 overflow-y-auto bg-panel-workspace custom-scrollbar transition-opacity duration-200 ${
              activeTab === 'workspace'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {rightPanel}
          </div>
        </div>
      </div>
    </PanelContext.Provider>
  );
}
