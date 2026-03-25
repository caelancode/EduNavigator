import { useLeftRail } from '../../contexts/LeftRailContext';
import {
  GRADE_BAND_OPTIONS,
  SETTING_OPTIONS,
  GROUPING_OPTIONS,
  TIME_RANGE_OPTIONS,
} from '../../constants/left-rail-options';

function findLabel(
  options: { value: string; label: string }[],
  value: string | null,
): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? null;
}

export function LearnerPortrait() {
  const { state } = useLeftRail();

  const items = [
    findLabel(GRADE_BAND_OPTIONS, state.gradeBand),
    findLabel(SETTING_OPTIONS, state.setting),
    findLabel(GROUPING_OPTIONS, state.grouping),
    findLabel(TIME_RANGE_OPTIONS, state.timeRange),
  ].filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="rounded-md bg-neutral-100 p-3 text-sm text-neutral-500">
        Select options below to build a learner portrait.
      </div>
    );
  }

  return (
    <div className="rounded-md bg-primary-50 p-3">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary-700">
        Current Context
      </p>
      <p className="text-sm text-primary-900">{items.join(' · ')}</p>
    </div>
  );
}
