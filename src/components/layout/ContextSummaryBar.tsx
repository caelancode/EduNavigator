import { useState } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { VALUE_LABELS } from '../../constants/system-prompt';
import { findLabel, multiSummary } from '../../utils/left-rail-summary';
import {
  GRADE_BAND_OPTIONS,
  SETTING_OPTIONS,
  GROUPING_OPTIONS,
  TIME_RANGE_OPTIONS,
  SUPPORT_AREA_OPTIONS,
  SUB_AREA_OPTIONS,
  TECH_CONTEXT_OPTIONS,
  OUTPUT_PREFERENCE_OPTIONS,
  ROLE_PERSPECTIVE_OPTIONS,
  COMMUNICATION_LEVEL_OPTIONS,
  MOBILITY_LEVEL_OPTIONS,
  SENSORY_OPTIONS,
  BEHAVIORAL_OPTIONS,
} from '../../constants/left-rail-options';

interface SectionProps {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

function Section({ title, rows }: SectionProps) {
  if (rows.length === 0) return null;
  return (
    <div className="flex-1 min-w-0 px-5 py-4">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
        {title}
      </p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-xs leading-none text-neutral-600">{row.label}</p>
            <p className="mt-0.5 text-xs font-semibold leading-snug text-neutral-900">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContextSummaryBar() {
  const { state } = useLeftRail();
  const [showTooltip, setShowTooltip] = useState(false);

  const hasUpdates = state.recentlyUpdatedFields.size > 0;

  // --- Tags for the compact bar display ---
  const tags: string[] = [];

  if (state.supportArea) {
    const label = VALUE_LABELS[state.supportArea] ?? state.supportArea;
    if (state.subArea) {
      const subLabel = VALUE_LABELS[state.subArea] ?? state.subArea;
      tags.push(`${label} > ${subLabel}`);
    } else {
      tags.push(label);
    }
  }
  if (state.gradeBand) tags.push(VALUE_LABELS[state.gradeBand] ?? state.gradeBand);
  if (state.grouping) tags.push(VALUE_LABELS[state.grouping] ?? state.grouping);
  if (state.setting) tags.push(VALUE_LABELS[state.setting] ?? state.setting);
  if (state.techContext) tags.push(VALUE_LABELS[state.techContext] ?? state.techContext);
  if (state.timeRange) tags.push(VALUE_LABELS[state.timeRange] ?? state.timeRange);

  const lc = state.learnerCharacteristics;
  for (const value of [
    ...lc.communicationLevel,
    ...lc.mobilityLevel,
    ...lc.sensoryConsiderations,
    ...lc.behavioralConsiderations,
  ]) {
    tags.push((VALUE_LABELS[value] ?? value).replace(/\s*\([^)]*\)/g, '').trim());
  }

  if (state.outputPreference) tags.push((VALUE_LABELS[state.outputPreference] ?? state.outputPreference).replace(/\s*\([^)]*\)/g, '').trim());
  if (state.rolePerspective) tags.push((VALUE_LABELS[state.rolePerspective] ?? state.rolePerspective).replace(/\s*\([^)]*\)/g, '').trim());

  const hasContext = tags.length > 0;

  // --- Tooltip sections ---
  const gradeBand = findLabel(GRADE_BAND_OPTIONS, state.gradeBand);
  const setting = findLabel(SETTING_OPTIONS, state.setting);
  const grouping = findLabel(GROUPING_OPTIONS, state.grouping);
  const timeRange = findLabel(TIME_RANGE_OPTIONS, state.timeRange);
  const supportArea = findLabel(SUPPORT_AREA_OPTIONS, state.supportArea);
  const subAreaOptions = state.supportArea ? SUB_AREA_OPTIONS[state.supportArea] : undefined;
  const subArea = subAreaOptions ? findLabel(subAreaOptions, state.subArea) : null;
  const communication = multiSummary(COMMUNICATION_LEVEL_OPTIONS, lc.communicationLevel);
  const mobility = multiSummary(MOBILITY_LEVEL_OPTIONS, lc.mobilityLevel);
  const sensory = multiSummary(SENSORY_OPTIONS, lc.sensoryConsiderations);
  const behavioral = multiSummary(BEHAVIORAL_OPTIONS, lc.behavioralConsiderations);
  const tech = findLabel(TECH_CONTEXT_OPTIONS, state.techContext);
  const output = findLabel(OUTPUT_PREFERENCE_OPTIONS, state.outputPreference);
  const role = findLabel(ROLE_PERSPECTIVE_OPTIONS, state.rolePerspective);

  const focusRows = [
    ...(supportArea
      ? [{ label: 'Support Area', value: subArea ? `${supportArea} › ${subArea}` : supportArea }]
      : []),
  ];

  const learnerRows = [
    ...(gradeBand ? [{ label: 'Grade Band', value: gradeBand }] : []),
    ...(communication ? [{ label: 'Communication', value: communication }] : []),
    ...(mobility ? [{ label: 'Mobility', value: mobility }] : []),
    ...(sensory ? [{ label: 'Sensory', value: sensory }] : []),
    ...(behavioral ? [{ label: 'Behavioral', value: behavioral }] : []),
  ];

  const setupRows = [
    ...(setting ? [{ label: 'Setting', value: setting }] : []),
    ...(grouping ? [{ label: 'Grouping', value: grouping }] : []),
    ...(timeRange ? [{ label: 'Time Available', value: timeRange }] : []),
    ...(tech ? [{ label: 'Technology', value: tech }] : []),
  ];

  const outputRows = [
    ...(output ? [{ label: 'Format', value: output }] : []),
    ...(role ? [{ label: 'Role', value: role }] : []),
  ];

  const activeSections = [focusRows, learnerRows, setupRows, outputRows].filter(
    (s) => s.length > 0,
  );
  const hasTooltipContent = activeSections.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {/* Compact bar */}
      <div
        role="status"
        aria-label="Current teaching context"
        tabIndex={hasContext ? 0 : undefined}
        className={`flex cursor-default items-center gap-2 border-b px-4 py-1.5 text-xs outline-none transition-colors duration-500 ${
          hasUpdates
            ? 'border-primary-200 bg-primary-50'
            : 'border-neutral-200/60 bg-neutral-50/80'
        }`}
      >
        <span className="shrink-0 font-semibold text-neutral-700">Context:</span>
        <span className="min-w-0 truncate text-neutral-800">
          {hasContext
            ? tags.join(' · ')
            : 'Describe your student for more targeted strategies'}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {hasUpdates && (
            <span className="animate-pulse rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700 motion-reduce:animate-none">
              Updated
            </span>
          )}
          {hasContext && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3 text-neutral-600 transition-colors duration-150"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Hover tooltip panel */}
      {showTooltip && hasContext && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-50 w-full animate-fade-in-up overflow-hidden border-x border-b border-neutral-200 bg-white shadow-card-hover"
          style={{ borderTop: '2px solid #9cc2b1' }}
        >
          {hasTooltipContent ? (
            <div className="flex divide-x divide-neutral-100">
              <Section title="Focus" rows={focusRows} />
              <Section title="Learner" rows={learnerRows} />
              <Section title="Setup" rows={setupRows} />
              <Section title="Output" rows={outputRows} />
            </div>
          ) : (
            <p className="px-5 py-4 text-xs text-neutral-400">
              No context set yet — fill in the left panel to get targeted strategies.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
