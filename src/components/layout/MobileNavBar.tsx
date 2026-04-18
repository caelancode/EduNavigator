import { type ReactNode } from 'react';

type MobileTab = 'left' | 'chat' | 'workspace';

interface MobileNavBarProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  strategyCount: number;
}

const TABS: { id: MobileTab; label: string; icon: ReactNode }[] = [
  {
    id: 'left',
    label: 'Context',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-hidden="true"
      >
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'Conversation',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'workspace',
    label: 'Strategies',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

export function MobileNavBar({ activeTab, onTabChange, strategyCount }: MobileNavBarProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <nav
      aria-label="Panel navigation"
      className="relative flex flex-shrink-0 border-b border-neutral-200 bg-neutral-50 lg:hidden"
    >
      {/* Sliding pill indicator — behind the tab buttons */}
      <div
        className="pointer-events-none absolute inset-y-1.5 left-0 w-1/3 px-2"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden="true"
      >
        <div className="h-full rounded-lg bg-primary-100 shadow-sm ring-1 ring-primary-200/60" />
      </div>

      {/* Tab buttons */}
      <div role="tablist" className="relative flex w-full">
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const distance = index - activeIndex;
          const translateX = distance * 10;
          const opacity = isActive ? 1 : Math.max(0.35, 1 - Math.abs(distance) * 0.38);
          const showBadge = tab.id === 'workspace' && strategyCount > 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-1.5 px-2 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
            >
              {/* Icon + label drift together */}
              <div
                style={{
                  transform: `translateX(${translateX}px)`,
                  opacity,
                  transition: 'transform 300ms ease-out, opacity 300ms ease-out',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  position: 'relative',
                }}
              >
                <span className={isActive ? 'text-primary-700' : 'text-neutral-400'}>
                  {tab.icon}
                </span>
                <span
                  className={
                    isActive
                      ? 'mobile-nav-label text-xs font-semibold tracking-tight text-primary-800'
                      : 'mobile-nav-label text-xs font-medium tracking-tight text-neutral-500'
                  }
                >
                  {tab.label}
                </span>

                {/* Badge — on Strategies tab when count > 0 */}
                {showBadge && (
                  <span
                    className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-0.5 text-[9px] font-bold leading-none text-white"
                    aria-label={`${strategyCount} ${strategyCount === 1 ? 'strategy' : 'strategies'}`}
                  >
                    {strategyCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
