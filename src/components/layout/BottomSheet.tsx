import { useEffect, useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}

export function BottomSheet({ isOpen, onClose, children, label }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === panel) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the panel when opened
    panel.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full transform flex-col rounded-t-3xl bg-surface-50 shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <button
          type="button"
          className="flex w-full shrink-0 cursor-pointer justify-center border-none bg-transparent pb-4 pt-3"
          onClick={onClose}
          aria-label="Close"
        >
          <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </button>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-8">
          {children}
        </div>
      </div>
    </>
  );
}
