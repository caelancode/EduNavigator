import { useState } from 'react';
import type { NextQuestion } from '../../types/context-update';
import { getLabelForFieldValue } from '../../utils/field-options';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { SUB_AREA_OPTIONS } from '../../constants/left-rail-options';

interface QuestionChipsProps {
  question: NextQuestion;
  isAnswered: boolean;
  isLoading?: boolean;
  onSelect: (value: string, label: string) => void;
}

export function QuestionChips({
  question,
  isAnswered,
  isLoading = false,
  onSelect,
}: QuestionChipsProps) {
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const { state: leftRailState } = useLeftRail();

  // Chips are "orphaned" when they offer sub-area options for a support area
  // that the user has since changed in the left rail. Disable them to prevent
  // setting a sub-area that doesn't belong to the current support area.
  const isOrphaned =
    question.isLocal === true &&
    question.field === 'subArea' &&
    leftRailState.supportArea !== null &&
    !(SUB_AREA_OPTIONS[leftRailState.supportArea] ?? []).some((o) =>
      question.options.includes(o.value),
    );

  const disabled = isAnswered || hasBeenUsed || isLoading || isOrphaned;

  return (
    <div
      role="group"
      aria-label={question.text}
      className={`mt-2 flex flex-wrap gap-2 ${disabled ? 'opacity-40' : ''}`}
    >
      {question.options.map((value) => {
        const label = getLabelForFieldValue(question.field, value);
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              setHasBeenUsed(true);
              onSelect(value, label);
            }}
            className={`rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-sm font-medium text-primary-700 transition-colors ${
              disabled
                ? 'pointer-events-none cursor-default'
                : 'hover:border-primary-400 hover:bg-primary-100 active:bg-primary-200'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
