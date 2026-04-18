import type { LeftRailState } from '../../types/left-rail';
import { findLabel, multiSummary } from '../../utils/left-rail-summary';
import {
  GRADE_BAND_OPTIONS,
  SETTING_OPTIONS,
  TIME_RANGE_OPTIONS,
  SUPPORT_AREA_OPTIONS,
  SUB_AREA_OPTIONS,
  ROLE_PERSPECTIVE_OPTIONS,
  COMMUNICATION_LEVEL_OPTIONS,
  MOBILITY_LEVEL_OPTIONS,
  SENSORY_OPTIONS,
  BEHAVIORAL_OPTIONS,
} from '../../constants/left-rail-options';

// Natural-language verb phrases for communication levels — [singular, plural]
// Strictly reflects only what the label tells us — no inferred details added
const COMM_PHRASES: Record<string, [string, string]> = {
  pre_symbolic: ['communicates pre-symbolically', 'communicate pre-symbolically'],
  emerging_symbolic: [
    'is at an emerging symbolic communication level',
    'are at an emerging symbolic communication level',
  ],
  symbolic: ['communicates symbolically', 'communicate symbolically'],
  verbal_limited: ['has limited verbal communication', 'have limited verbal communication'],
  verbal_fluent: ['communicates verbally', 'communicate verbally'],
  aac_user: ['uses AAC to communicate', 'use AAC to communicate'],
};

// Prose labels for communication levels used in multi-value lists
const COMM_PROSE: Record<string, string> = {
  pre_symbolic: 'pre-symbolic',
  emerging_symbolic: 'emerging symbolic',
  symbolic: 'symbolic',
  verbal_limited: 'limited verbal',
  verbal_fluent: 'verbal',
  aac_user: 'AAC',
};

// Natural-language verb phrases for mobility — [singular, plural]
// Strictly reflects only what the label tells us — no inferred details added
const MOBILITY_PHRASES: Record<string, [string, string]> = {
  independent: ['moves independently', 'move independently'],
  assisted_walking: ['uses assisted walking', 'use assisted walking'],
  wheelchair: ['uses a wheelchair', 'use wheelchairs'],
  limited_mobility: ['has limited mobility', 'have limited mobility'],
};

// Natural phrasing for output preferences
const OUTPUT_PHRASES: Record<string, string> = {
  step_by_step: 'step-by-step instructions',
  scripts: 'ready-to-use scripts and prompts',
  quick_ideas: 'quick, actionable ideas',
  rationale: 'the research rationale behind each strategy',
};

function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function buildContextSummary(context: LeftRailState): string {
  const parts: string[] = [];

  const gradeBand = findLabel(GRADE_BAND_OPTIONS, context.gradeBand);
  const setting = findLabel(SETTING_OPTIONS, context.setting);
  const grouping = context.grouping;
  const timeRange = findLabel(TIME_RANGE_OPTIONS, context.timeRange);
  const supportArea = findLabel(SUPPORT_AREA_OPTIONS, context.supportArea);
  const subAreaOptions = context.supportArea ? SUB_AREA_OPTIONS[context.supportArea] : undefined;
  const subArea = subAreaOptions ? findLabel(subAreaOptions, context.subArea) : null;
  const role = findLabel(ROLE_PERSPECTIVE_OPTIONS, context.rolePerspective);

  const isGroup =
    grouping === 'small_group' || grouping === 'whole_class' || grouping === 'mixed';
  // Used to conjugate verbs in characteristic sentences
  const learner = isGroup ? 'The students' : 'The student';

  // --- Opening sentence: who + where + how long ---
  const openFragments: string[] = [];

  if (grouping === 'one_on_one') {
    openFragments.push('Working one-on-one');
    if (gradeBand) openFragments.push(`with a ${gradeBand} student`);
  } else if (grouping === 'small_group') {
    openFragments.push('Supporting a small group');
    if (gradeBand) openFragments.push(`of ${gradeBand} students`);
  } else if (grouping === 'whole_class') {
    openFragments.push('Teaching a whole class');
    if (gradeBand) openFragments.push(`of ${gradeBand} students`);
  } else if (grouping === 'mixed') {
    openFragments.push('Working with a mixed group');
    if (gradeBand) openFragments.push(`of ${gradeBand} students`);
  } else if (gradeBand) {
    openFragments.push(`Working with ${gradeBand} students`);
  }

  if (setting) openFragments.push(`in a ${setting.toLowerCase()} setting`);
  if (timeRange) openFragments.push(`for ${timeRange.toLowerCase()} sessions`);

  if (openFragments.length > 0) {
    parts.push(openFragments.join(' ') + '.');
  }

  // --- Focus area ---
  const focusLabel = subArea ?? supportArea;
  if (focusLabel) {
    parts.push(`The focus is on ${focusLabel.toLowerCase()}.`);
  }

  // --- Communication ---
  const commValues = context.learnerCharacteristics.communicationLevel;
  if (commValues.length === 1) {
    const phrases = COMM_PHRASES[commValues[0]];
    if (phrases) {
      parts.push(`${learner} ${isGroup ? phrases[1] : phrases[0]}.`);
    }
  } else if (commValues.length > 1) {
    const labels = commValues
      .map((v) => COMM_PROSE[v] ?? findLabel(COMMUNICATION_LEVEL_OPTIONS, v)?.toLowerCase())
      .filter(Boolean) as string[];
    parts.push(
      `${learner} ${isGroup ? 'use' : 'uses'} a mix of communication approaches — ${joinList(labels)}.`,
    );
  }

  // --- Mobility ---
  const mobValues = context.learnerCharacteristics.mobilityLevel;
  if (mobValues.length === 1) {
    const phrases = MOBILITY_PHRASES[mobValues[0]];
    if (phrases) {
      parts.push(`${learner} ${isGroup ? phrases[1] : phrases[0]}.`);
    }
  } else if (mobValues.length > 1) {
    const labels = mobValues
      .map((v) => findLabel(MOBILITY_LEVEL_OPTIONS, v)?.toLowerCase())
      .filter(Boolean) as string[];
    parts.push(`Mobility varies: ${joinList(labels)}.`);
  }

  // --- Sensory ---
  const sensoryLabels = multiSummary(
    SENSORY_OPTIONS,
    context.learnerCharacteristics.sensoryConsiderations,
  );
  if (sensoryLabels) {
    parts.push(`There are sensory considerations to keep in mind: ${sensoryLabels.toLowerCase()}.`);
  }

  // --- Behavioral ---
  const behavioralLabels = multiSummary(
    BEHAVIORAL_OPTIONS,
    context.learnerCharacteristics.behavioralConsiderations,
  );
  if (behavioralLabels) {
    parts.push(`Behaviorally, there are a few things to be aware of: ${behavioralLabels.toLowerCase()}.`);
  }

  // --- Technology ---
  if (context.techContext === 'no_tech') {
    parts.push('No technology is available for this session.');
  } else if (context.techContext === 'minimal_tech') {
    parts.push('Basic devices like tablets or computers are available.');
  } else if (context.techContext === 'specialized_tech') {
    parts.push(`${learner} ${isGroup ? 'use' : 'uses'} specialized or assistive technology.`);
  }

  // --- Output preference + role ---
  const outputPhrase = context.outputPreference ? OUTPUT_PHRASES[context.outputPreference] : null;
  if (outputPhrase || role) {
    const clauseParts: string[] = [];
    if (outputPhrase) clauseParts.push(outputPhrase);
    if (role) clauseParts.push(`geared toward a ${role.toLowerCase()}`);
    parts.push(`Strategies should be formatted as ${clauseParts.join(', ')}.`);
  }

  // --- Conversational context from AI ---
  if (context.contextNotes) {
    parts.push(context.contextNotes);
  }

  // --- Educator notes ---
  for (const [, note] of Object.entries(context.stepNotes)) {
    if (typeof note === 'string' && note.trim()) {
      parts.push(`The educator also noted: "${note.trim()}"`);
    }
  }

  return parts.join(' ');
}

interface ContextSummaryBarProps {
  context: LeftRailState;
}

export function ContextSummaryBar({ context }: ContextSummaryBarProps) {
  const summary = buildContextSummary(context);
  if (!summary) return null;

  return (
    <div
      role="region"
      aria-label="Your current teaching context"
      className="border-t border-primary-200 bg-primary-50 px-4 py-3 animate-fade-in-up motion-reduce:animate-none"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-500">
        Your context
      </p>
      <p className="mt-1 text-sm leading-relaxed text-primary-900">
        {summary}
      </p>
    </div>
  );
}
