import { useRef, useEffect, type ReactNode } from 'react';

interface AccordionFieldProps {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  required?: boolean;
  children: ReactNode;
  otherInput?: ReactNode;
  /** Current human-readable value for display when collapsed. */
  currentValue?: string;
  /** Whether this field was inferred by AI (shows "inferred" indicator) */
  isInferred?: boolean;
  /** Whether this field was just updated by AI (triggers highlight animation) */
  isHighlighted?: boolean;
}

export function AccordionField({
  id,
  label,
  isOpen,
  onToggle,
  required,
  children,
  otherInput,
  currentValue,
  isInferred,
  isHighlighted,
}: AccordionFieldProps) {
  const headerId = `accordion-header-${id}`;
  const bodyId = `accordion-body-${id}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const timer = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 30);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`border-b border-neutral-200/60 ${isHighlighted ? 'animate-field-highlight' : ''}`}>
      <button
        id={headerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        className="group flex w-full items-center justify-between px-1 py-2 text-left"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-1.5 font-heading text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
            {label}
            {required && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200" aria-label="required">
                Required
              </span>
            )}
            {isInferred && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-200">
                Inferred
              </span>
            )}
          </span>
          {!isOpen && currentValue && (
            <span className="truncate text-sm text-neutral-500">
              {currentValue}
            </span>
          )}
        </span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
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
        id={bodyId}
        role="region"
        aria-labelledby={headerId}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-1 pb-3 pt-1.5">
            {children}
            {otherInput}
          </div>
        </div>
      </div>
    </div>
  );
}
