import type { LeftRailState } from '../../types/left-rail';
import { findLabel } from '../../utils/left-rail-summary';
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
  COMMUNICATION_LEVEL_OPTIONS,
  MOBILITY_LEVEL_OPTIONS,
  SENSORY_OPTIONS,
  BEHAVIORAL_OPTIONS,
} from '../../constants/left-rail-options';

interface ExportHeaderProps {
  context: LeftRailState;
  generatedAt: number;
}

export function ExportHeader({ context, generatedAt }: ExportHeaderProps) {
  const subAreaOptions = context.supportArea
    ? SUB_AREA_OPTIONS[context.supportArea] ?? []
    : [];

  const findLabels = (
    options: { value: string; label: string }[],
    values: string[],
  ): string => {
    if (values.length === 0) return '';
    return values
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .join(', ');
  };

  const learnerRows: [string, string][] = [
    ['Communication', findLabels(COMMUNICATION_LEVEL_OPTIONS, context.learnerCharacteristics.communicationLevel)],
    ['Mobility', findLabels(MOBILITY_LEVEL_OPTIONS, context.learnerCharacteristics.mobilityLevel)],
    ['Sensory', findLabels(SENSORY_OPTIONS, context.learnerCharacteristics.sensoryConsiderations)],
    ['Behavioral', findLabels(BEHAVIORAL_OPTIONS, context.learnerCharacteristics.behavioralConsiderations)],
  ].filter(([, v]) => v.length > 0) as [string, string][];

  const rows: [string, string][] = [
    ['Grade/Age Band', findLabel(GRADE_BAND_OPTIONS, context.gradeBand) ?? '—'],
    ['Setting', findLabel(SETTING_OPTIONS, context.setting) ?? '—'],
    ['Grouping', findLabel(GROUPING_OPTIONS, context.grouping) ?? '—'],
    ['Time Available', findLabel(TIME_RANGE_OPTIONS, context.timeRange) ?? '—'],
    ['Support Area', findLabel(SUPPORT_AREA_OPTIONS, context.supportArea) ?? '—'],
    ['Sub-Area', findLabel(subAreaOptions, context.subArea) ?? '—'],
    ['Technology', findLabel(TECH_CONTEXT_OPTIONS, context.techContext) ?? '—'],
    [
      'Output Preference',
      findLabel(OUTPUT_PREFERENCE_OPTIONS, context.outputPreference) ?? '—',
    ],
    [
      'Role Perspective',
      findLabel(ROLE_PERSPECTIVE_OPTIONS, context.rolePerspective) ?? '—',
    ],
  ];

  return (
    <div className="export-header mb-10 font-[system-ui]">
      <div className="mb-2 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-primary-700"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
          EduNavigator — Strategy Report
        </h1>
      </div>

      <p className="mb-6 text-sm text-neutral-600">
        Generated{' '}
        {new Date(generatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <hr className="mb-8 border-neutral-200" />

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-neutral-800">
          Educator Context
        </h2>
        <div className="flex flex-col border-t border-neutral-200">
          {rows
            .filter(([, value]) => value !== '—')
            .map(([label, value]) => (
              <div key={label} className="flex border-b border-neutral-200 py-2.5">
                <div className="w-1/3 pr-4 text-sm font-medium text-neutral-600">
                  {label}
                </div>
                <div className="w-2/3 text-sm text-neutral-800">
                  {value}
                </div>
              </div>
            ))}
        </div>
        {learnerRows.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              Learner Characteristics
            </h3>
            <div className="flex flex-col border-t border-neutral-200">
              {learnerRows.map(([label, value]) => (
                <div key={label} className="flex border-b border-neutral-200 py-2.5">
                  <div className="w-1/3 pr-4 text-sm font-medium text-neutral-600">
                    {label}
                  </div>
                  <div className="w-2/3 text-sm text-neutral-800">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
