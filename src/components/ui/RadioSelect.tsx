import { useRef, useCallback } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioSelectProps {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  groupLabel: string;
  /** Kept for API compatibility — has no visual effect since there is no trigger label */
  srOnlyLabel?: boolean;
}

export function RadioSelect({
  options,
  value,
  onChange,
  onSelect,
  groupLabel,
}: RadioSelectProps) {
  // One ref per option so we can move focus with arrow keys
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (opt: RadioOption) => {
      onChange(opt.value);
      onSelect?.(opt.value);
    },
    [onChange, onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (index + 1) % options.length;
        optionRefs.current[next]?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (index - 1 + options.length) % options.length;
        optionRefs.current[prev]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(options[index]);
      }
    },
    [options, handleSelect],
  );

  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className="space-y-1.5"
    >
      {options.map((opt, i) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => { optionRefs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(opt)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
              isSelected
                ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-card'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span className="flex flex-col gap-0.5">
              <span className={isSelected ? 'font-semibold' : 'font-medium'}>
                {opt.label}
              </span>
              {opt.description && (
                <span className={`text-xs ${isSelected ? 'text-primary-600/80' : 'text-neutral-500'}`}>
                  {opt.description}
                </span>
              )}
            </span>

            {isSelected && (
              <svg
                className="ml-3 h-4 w-4 shrink-0 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
