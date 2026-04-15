import { useState } from 'react';
import type { ReactNode } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  legend: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  collapsible?: boolean;
  defaultOpen?: boolean;
  legendExtra?: ReactNode;
  srOnlyLegend?: boolean;
}

export function MultiSelect({
  legend,
  options,
  selectedValues,
  onChange,
  collapsible = false,
  defaultOpen = false,
  legendExtra,
  srOnlyLegend = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  const selectedCount = selectedValues.length;

  if (collapsible) {
    return (
      <fieldset className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <legend className="contents">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50/60"
          >
            <svg
              className={`h-3.5 w-3.5 shrink-0 text-neutral-600 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-90' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="font-heading text-sm font-semibold text-neutral-700">
                {legend}
              </span>
              {legendExtra}
            </span>
            {selectedCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-100 px-1.5 text-sm font-bold text-primary-700">
                {selectedCount}
              </span>
            )}
          </button>
        </legend>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-neutral-100 px-3.5 py-2">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex min-h-[36px] cursor-pointer items-start gap-2.5 rounded-md px-1 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(opt.value)}
                    onChange={() => handleToggle(opt.value)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>
                    {opt.label}
                    {opt.description && (
                      <span className="block text-sm leading-snug text-neutral-700">{opt.description}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    );
  }

  // Non-collapsible (flat) mode
  return (
    <fieldset className="space-y-2">
      <legend className={srOnlyLegend ? 'sr-only' : 'flex items-center gap-1.5 font-heading text-sm font-semibold text-neutral-800'}>{legend}{!srOnlyLegend && legendExtra}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex min-h-[44px] items-start gap-2 cursor-pointer py-1.5 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              {opt.label}
              {opt.description && (
                <span className="block text-sm text-neutral-700">{opt.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
