import { z } from 'zod';
import DOMPurify from 'dompurify';
import type { ContextUpdate } from '../types/context-update';
import {
  GRADE_BAND_OPTIONS,
  SETTING_OPTIONS,
  GROUPING_OPTIONS,
  TIME_RANGE_OPTIONS,
  TECH_CONTEXT_OPTIONS,
  OUTPUT_PREFERENCE_OPTIONS,
  ROLE_PERSPECTIVE_OPTIONS,
  SUPPORT_AREA_OPTIONS,
  SUB_AREA_OPTIONS,
} from '../constants/left-rail-options';

// ── Build valid value sets from the option constants ────────────────────────

function valuesFrom<T extends { value: string }>(opts: readonly T[]): string[] {
  return opts.map((o) => o.value);
}

/** Map from field name to valid enum values. Used for validation and chip rendering. */
export const VALID_FIELD_VALUES: Record<string, readonly string[]> = {
  gradeBand: valuesFrom(GRADE_BAND_OPTIONS),
  setting: valuesFrom(SETTING_OPTIONS),
  grouping: valuesFrom(GROUPING_OPTIONS),
  timeRange: valuesFrom(TIME_RANGE_OPTIONS),
  techContext: valuesFrom(TECH_CONTEXT_OPTIONS),
  outputPreference: valuesFrom(OUTPUT_PREFERENCE_OPTIONS),
  rolePerspective: valuesFrom(ROLE_PERSPECTIVE_OPTIONS),
  supportArea: valuesFrom(SUPPORT_AREA_OPTIONS),
  subArea: Object.values(SUB_AREA_OPTIONS).flatMap(valuesFrom),
};

// ── Extractable field names (the set of fields AI is allowed to write) ──────

const EXTRACTABLE_FIELDS = new Set(Object.keys(VALID_FIELD_VALUES));

// ── Zod schemas ─────────────────────────────────────────────────────────────

const AIContextUpdatesSchema = z
  .record(z.string(), z.unknown())
  .transform((obj) => {
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!EXTRACTABLE_FIELDS.has(key)) continue;
      if (typeof value !== 'string') continue;
      const validValues = VALID_FIELD_VALUES[key];
      if (validValues && validValues.includes(value)) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  });

const NextQuestionSchema = z.object({
  field: z.string().min(1),
  text: z.string().min(1).max(500),
  options: z.array(z.string()).min(1).max(10),
});

const ContextUpdateSchema = z.object({
  updates: AIContextUpdatesSchema,
  nextQuestion: NextQuestionSchema.optional(),
});

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate and sanitize a parsed context-update JSON object.
 * Returns null for invalid, degenerate (empty updates + no question), or malformed input.
 */
export function validateContextUpdate(
  parsed: unknown,
): ContextUpdate | null {
  const result = ContextUpdateSchema.safeParse(parsed);

  if (!result.success) {
    return null;
  }

  const { updates, nextQuestion } = result.data;

  // Reject degenerate updates: empty updates with no question
  const hasUpdates = Object.keys(updates).length > 0;
  const hasQuestion = nextQuestion !== undefined;

  if (!hasUpdates && !hasQuestion) {
    return null;
  }

  // Sanitize the question text if present
  const sanitizedQuestion = nextQuestion
    ? {
        field: nextQuestion.field,
        text: DOMPurify.sanitize(nextQuestion.text),
        options: nextQuestion.options,
      }
    : undefined;

  return {
    updates: updates as ContextUpdate['updates'],
    nextQuestion: sanitizedQuestion,
  };
}
