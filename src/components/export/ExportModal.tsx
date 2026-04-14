import { useEffect, useRef, useState, useCallback } from 'react';
import type { Strategy } from '../../types/strategy';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { BADGE_COLORS } from '../../constants/badge-colors';

interface ExportModalProps {
  isOpen: boolean;
  strategies: Strategy[];
  onClose: () => void;
}

export function ExportModal({ isOpen, strategies, onClose }: ExportModalProps) {
  const { toggleSelection, clearSelection } = useWorkspace();

  // Local transient checkbox state — all checked by default on open
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());
  const firstCheckboxRef = useRef<HTMLInputElement>(null);

  // Reset to all-checked each time modal opens
  useEffect(() => {
    if (isOpen) {
      setCheckedIndices(new Set(strategies.map((_, i) => i)));
      // Defer focus so the dialog is rendered before we focus
      const id = setTimeout(() => firstCheckboxRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen, strategies]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleCheck = useCallback((index: number) => {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const allChecked = checkedIndices.size === strategies.length;

  const handleSelectAll = useCallback(() => {
    if (allChecked) {
      setCheckedIndices(new Set());
    } else {
      setCheckedIndices(new Set(strategies.map((_, i) => i)));
    }
  }, [allChecked, strategies]);

  const handleExport = useCallback(() => {
    // Write checked indices to context so ExportView renders them
    clearSelection();
    checkedIndices.forEach((index) => toggleSelection(index));
    onClose();
    window.print();
    // Clear after print dialog so ExportView goes back to hidden
    setTimeout(() => clearSelection(), 300);
  }, [checkedIndices, toggleSelection, clearSelection, onClose]);

  if (!isOpen) return null;

  const noneChecked = checkedIndices.size === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-in-up motion-reduce:animate-none"
        style={{ animationDuration: '150ms' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
          aria-describedby="export-modal-desc"
          className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-scale-in motion-reduce:animate-none"
        >
          {/* Header */}
          <div className="mb-1 shrink-0 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </div>
            <div>
              <h2
                id="export-modal-title"
                className="font-heading text-lg font-bold text-neutral-900"
              >
                Export to PDF
              </h2>
              <p
                id="export-modal-desc"
                className="text-sm text-neutral-500"
              >
                Choose the strategies to include.
              </p>
            </div>
          </div>

          {/* Select all toggle */}
          <div className="mt-4 mb-2 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              {allChecked ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {/* Strategy list — scrollable when content overflows */}
          <ul className="custom-scrollbar flex flex-col gap-2 overflow-y-auto" role="list">
            {strategies.map((strategy, index) => {
              const checked = checkedIndices.has(index);
              const checkboxId = `export-strategy-${index}`;
              return (
                <li key={`${strategy.title}-${index}`}>
                  <label
                    htmlFor={checkboxId}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${checked ? 'border-primary-200 bg-primary-50' : 'border-neutral-100 bg-neutral-50 hover:bg-neutral-100'}`}
                  >
                    <input
                      ref={index === 0 ? firstCheckboxRef : undefined}
                      id={checkboxId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(index)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${BADGE_COLORS[index % BADGE_COLORS.length]}`}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-neutral-900">
                          {strategy.title}
                        </p>
                        {strategy.context_tagline && (
                          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 italic">
                            {strategy.context_tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Validation message — sits tight below the list */}
          {noneChecked && (
            <p className="mt-2 shrink-0 text-[11px] text-neutral-400" role="alert">
              Select at least one strategy to export.
            </p>
          )}

          {/* Footer — pinned, never scrolls */}
          <div className="mt-4 shrink-0 flex flex-col gap-3">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-press rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-card transition-colors hover:bg-neutral-50 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={noneChecked}
                className="btn-press rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-600"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
