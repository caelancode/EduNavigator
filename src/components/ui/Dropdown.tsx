import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  id?: string;
  labelExtra?: ReactNode;
  srOnlyLabel?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  onSelect,
  placeholder = 'Select...',
  id,
  labelExtra,
  srOnlyLabel = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectId = id ?? `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const listboxId = `${selectId}-listbox`;

  const selectedOption = options.find((o) => o.value === value);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setFocusedIndex(idx >= 0 ? idx : 0);
  }, [options, value]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  }, []);

  const selectOption = useCallback(
    (opt: DropdownOption) => {
      onChange(opt.value);
      onSelect?.(opt.value);
      closeMenu();
    },
    [onChange, onSelect, closeMenu],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Scroll the bottom of the list into view once the animation is underway,
  // so the full dropdown is visible even when opened at the bottom of the rail.
  useEffect(() => {
    if (!isOpen || !listboxRef.current) return;
    const timer = setTimeout(() => {
      listboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 320); // after the 300ms animation completes (+ 20ms buffer)
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll focused option into view within the list
  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;
    const items = listboxRef.current?.children;
    if (items?.[focusedIndex]) {
      (items[focusedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, focusedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            selectOption(options[focusedIndex]);
          } else {
            openMenu();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            setFocusedIndex((i) => (i < options.length - 1 ? i + 1 : i));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((i) => (i > 0 ? i - 1 : i));
          }
          break;
        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            closeMenu();
          }
          break;
        case 'Home':
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          break;
        case 'End':
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(options.length - 1);
          }
          break;
        default:
          // Type-ahead: jump to first option starting with the pressed key
          if (isOpen && e.key.length === 1) {
            const char = e.key.toLowerCase();
            const startIdx = focusedIndex + 1;
            const idx = options.findIndex(
              (o, i) => i >= startIdx && o.label.toLowerCase().startsWith(char),
            );
            if (idx >= 0) {
              setFocusedIndex(idx);
            } else {
              const wrapIdx = options.findIndex((o) =>
                o.label.toLowerCase().startsWith(char),
              );
              if (wrapIdx >= 0) setFocusedIndex(wrapIdx);
            }
          }
      }
    },
    [isOpen, focusedIndex, options, openMenu, closeMenu, selectOption],
  );

  return (
    <div ref={containerRef}>
      {!srOnlyLabel && (
        <label
          id={`${selectId}-label`}
          className="mb-1.5 flex items-center gap-1.5 font-heading text-sm font-semibold text-neutral-800"
        >
          {label}
          {labelExtra}
        </label>
      )}
      {srOnlyLabel && (
        <label id={`${selectId}-label`} className="sr-only">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={`${selectId}-label`}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-4 text-sm transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
          selectedOption
            ? 'border-primary-200 text-neutral-800 shadow-card'
            : 'border-neutral-200 text-neutral-600 shadow-card'
        }`}
      >
        <span className={selectedOption ? 'font-medium' : ''}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-600 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/*
        Inline expanding list — uses the same grid-template-rows animation as AccordionField.
        Because it lives in the normal document flow, it pushes everything below it down as
        it opens, exactly like a nested accordion.  No portal, no fixed positioning.

        The pb-4 wrapper gives 16 px of clear space below the ul so shadow-lg isn't clipped
        by the ancestor overflow-hidden containers.
      */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-8 pt-1.5">
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={`${selectId}-label`}
              className="max-h-60 overflow-auto rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg shadow-black/10"
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === value;
                const isFocused = i === focusedIndex;
                return (
                  <li
                    key={opt.value}
                    id={`${selectId}-option-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(opt)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectOption(opt);
                      }
                    }}
                    onMouseEnter={() => setFocusedIndex(i)}
                    className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors ${
                      isFocused ? 'bg-primary-50' : ''
                    } ${isSelected ? 'font-medium text-primary-700' : 'text-neutral-700'}`}
                  >
                    {opt.label}
                    {isSelected && (
                      <svg
                        className="h-4 w-4 shrink-0 text-primary-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
