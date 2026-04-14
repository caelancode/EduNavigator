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

/** Maps field name → option array for label lookup. */
const FIELD_OPTIONS_MAP: Record<string, readonly { value: string; label: string }[]> = {
  gradeBand: GRADE_BAND_OPTIONS,
  setting: SETTING_OPTIONS,
  grouping: GROUPING_OPTIONS,
  timeRange: TIME_RANGE_OPTIONS,
  techContext: TECH_CONTEXT_OPTIONS,
  outputPreference: OUTPUT_PREFERENCE_OPTIONS,
  rolePerspective: ROLE_PERSPECTIVE_OPTIONS,
  supportArea: SUPPORT_AREA_OPTIONS,
};

/**
 * Look up the human-readable label for a field value.
 * Falls back to the raw value if no match is found.
 */
export function getLabelForFieldValue(field: string, value: string): string {
  // Check direct field options first
  const options = FIELD_OPTIONS_MAP[field];
  if (options) {
    const match = options.find((o) => o.value === value);
    if (match) return match.label;
  }

  // For subArea, search across all support area sub-options
  if (field === 'subArea') {
    for (const subOptions of Object.values(SUB_AREA_OPTIONS)) {
      const match = subOptions.find((o) => o.value === value);
      if (match) return match.label;
    }
  }

  return value;
}
