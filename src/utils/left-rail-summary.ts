import type { SelectOption } from '../constants/left-rail-options';

/** Look up the display label for a single-select value */
export function findLabel(options: SelectOption[], value: string | null): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? null;
}

/** Build a summary string for multi-select values (full labels, no truncation) */
export function multiSummary(options: SelectOption[], values: string[]): string | null {
  if (values.length === 0) return null;
  const labels = values
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];
  if (labels.length === 0) return null;
  return labels.join(', ');
}
