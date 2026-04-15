import { useState, type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  titleExtra?: ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  badge,
  titleExtra,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between px-1 py-4 font-heading text-sm font-semibold text-neutral-800 hover:text-neutral-900"
      >
        <span className="flex items-center gap-2">
          {title}
          {titleExtra}
          {badge && !isOpen && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-700">
              {badge}
            </span>
          )}
        </span>
        <svg
          className={`h-5 w-5 text-neutral-600 transition-transform duration-200 motion-reduce:transition-none group-hover:text-neutral-700 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
