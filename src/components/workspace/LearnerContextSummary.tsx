import { useState } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';
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

/** Builds a friendly, readable summary from left rail selections */
function buildDescription(labels: Record<string, string | null>): string {
  const sentences: string[] = [];

  // Opening sentence: who is this learner?
  const whoFragments: string[] = [];
  if (labels.gradeBand) whoFragments.push(`a ${labels.gradeBand} learner`);
  if (labels.setting) whoFragments.push(`in a ${labels.setting.toLowerCase()} setting`);
  if (whoFragments.length > 0) {
    sentences.push(`This is ${whoFragments.join(' ')}.`);
  }

  // Instructional setup
  const setupFragments: string[] = [];
  if (labels.grouping) setupFragments.push(`${labels.grouping.toLowerCase()} instruction`);
  if (labels.timeRange) setupFragments.push(`${labels.timeRange} sessions`);
  if (setupFragments.length > 0) {
    sentences.push(setupFragments.join(', ').replace(/^./, (c) => c.toUpperCase()) + '.');
  }

  // Support focus
  if (labels.supportArea) {
    const focus = labels.subArea
      ? `${labels.supportArea.toLowerCase()}, specifically ${labels.subArea.toLowerCase()}`
      : labels.supportArea.toLowerCase();
    sentences.push(`The focus area is ${focus}.`);
  }

  // Learner characteristics — each category phrased naturally
  if (labels.communication) {
    sentences.push(`Communication: ${labels.communication.toLowerCase()}.`);
  }
  if (labels.mobility) {
    sentences.push(`Mobility: ${labels.mobility.toLowerCase()}.`);
  }
  if (labels.sensory) {
    sentences.push(`Sensory considerations: ${labels.sensory.toLowerCase()}.`);
  }
  if (labels.behavioral) {
    sentences.push(`Behavioral considerations: ${labels.behavioral.toLowerCase()}.`);
  }

  // Technology & preferences
  if (labels.tech) {
    sentences.push(`Technology access: ${labels.tech.toLowerCase()}.`);
  }
  if (labels.output || labels.role) {
    const prefParts: string[] = [];
    if (labels.output) prefParts.push(`${labels.output.toLowerCase()} format`);
    if (labels.role) prefParts.push(`written for a ${labels.role.toLowerCase()}`);
    sentences.push(`Strategies should be in ${prefParts.join(', ')}.`);
  }

  return sentences.join(' ');
}

export function LearnerContextSummary() {
  const { state } = useLeftRail();
  const [collapsed, setCollapsed] = useState(true);

  // Compute labels
  const gradeBand = findLabel(GRADE_BAND_OPTIONS, state.gradeBand);
  const setting = findLabel(SETTING_OPTIONS, state.setting);
  const grouping = findLabel(GROUPING_OPTIONS, state.grouping);
  const timeRange = findLabel(TIME_RANGE_OPTIONS, state.timeRange);
  const supportArea = findLabel(SUPPORT_AREA_OPTIONS, state.supportArea);
  const subAreaOptions = state.supportArea ? SUB_AREA_OPTIONS[state.supportArea] : undefined;
  const subArea = subAreaOptions ? findLabel(subAreaOptions, state.subArea) : null;
  const communication = multiSummary(COMMUNICATION_LEVEL_OPTIONS, state.learnerCharacteristics.communicationLevel);
  const mobility = multiSummary(MOBILITY_LEVEL_OPTIONS, state.learnerCharacteristics.mobilityLevel);
  const sensory = multiSummary(SENSORY_OPTIONS, state.learnerCharacteristics.sensoryConsiderations);
  const behavioral = multiSummary(BEHAVIORAL_OPTIONS, state.learnerCharacteristics.behavioralConsiderations);
  const tech = findLabel(TECH_CONTEXT_OPTIONS, state.techContext);
  const output = findLabel(OUTPUT_PREFERENCE_OPTIONS, state.outputPreference);
  const role = findLabel(ROLE_PERSPECTIVE_OPTIONS, state.rolePerspective);

  // Don't render if nothing selected
  const hasAnySelection = [
    gradeBand, setting, grouping, timeRange, supportArea,
    communication, mobility, sensory, behavioral, tech, output, role,
  ].some(Boolean);
  if (!hasAnySelection) return null;

  const description = buildDescription({
    gradeBand, setting, grouping, timeRange,
    supportArea, subArea,
    communication, mobility, sensory, behavioral,
    tech, output, role,
  });

  return (
    <div
      role="region"
      aria-label="Learner context summary"
      className="border-b border-neutral-100 bg-surface-50"
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-2 px-5 py-2.5 text-left text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 text-neutral-600"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span className="flex-1">Learner Context</span>
        <svg
          className={`h-3 w-3 text-neutral-600 transition-transform duration-200 motion-reduce:transition-none ${collapsed ? '' : 'rotate-180'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-3" aria-live="polite">
            <p className="text-sm leading-relaxed text-neutral-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
