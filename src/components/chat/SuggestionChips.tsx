import { useState } from 'react';
import type { SuggestionChip } from '../../types/chat';

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  /** True when the user has already sent a follow-up message after this one */
  isAnswered: boolean;
  isLoading?: boolean;
  onSelect: (message: string) => void;
}

export function SuggestionChips({
  chips,
  isAnswered,
  isLoading = false,
  onSelect,
}: SuggestionChipsProps) {
  const [hasBeenUsed, setHasBeenUsed] = useState(false);

  const disabled = isAnswered || hasBeenUsed || isLoading;

  return (
    <div className={`mt-3 ${disabled ? 'opacity-40' : ''}`}>
      <div
        role="group"
        aria-label="Suggested next steps"
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              setHasBeenUsed(true);
              onSelect(chip.message);
            }}
            className={`rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors ${
              disabled
                ? 'pointer-events-none cursor-default'
                : 'hover:border-slate-400 hover:bg-slate-100 active:bg-slate-200'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
