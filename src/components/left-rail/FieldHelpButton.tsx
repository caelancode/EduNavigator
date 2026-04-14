import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface FieldHelpButtonProps {
  description: string;
  label?: string;
}

export function FieldHelpButton({ description, label = 'Help' }: FieldHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [flipped, setFlipped] = useState(false);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = 256; // w-64 = 16rem = 256px

    // Measure actual tooltip height if available, otherwise use generous estimate
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 200;

    // Center horizontally on the button, clamp to viewport edges
    let left = rect.left + rect.width / 2;
    const minLeft = tooltipWidth / 2 + 8;
    const maxLeft = window.innerWidth - tooltipWidth / 2 - 8;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    // Flip above if not enough room below
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlip = spaceBelow < tooltipHeight + 16;
    setFlipped(shouldFlip);

    setPosition({
      top: shouldFlip ? rect.top - tooltipHeight - 8 : rect.bottom + 8,
      left,
    });
  }, []);

  // Reposition after tooltip renders so we can measure its actual height
  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        className="relative inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-help items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold leading-none text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-700">
          ?
        </span>
      </button>
      {isOpen &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            className="pointer-events-none fixed z-[9999] w-64 -translate-x-1/2 whitespace-pre-line rounded-lg bg-neutral-800 px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {description}
            {flipped ? (
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
            ) : (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-800" />
            )}
          </span>,
          document.body,
        )}
    </>
  );
}
