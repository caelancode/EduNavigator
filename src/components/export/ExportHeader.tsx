import type { LeftRailState } from '../../types/left-rail';
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
} from '../../constants/left-rail-options';

interface ExportHeaderProps {
  context: LeftRailState;
  generatedAt: number;
}

function findLabel(
  options: { value: string; label: string }[],
  value: string | null,
): string {
  if (!value) return '—';
  return options.find((o) => o.value === value)?.label ?? value;
}

export function ExportHeader({ context, generatedAt }: ExportHeaderProps) {
  const subAreaOptions = context.supportArea
    ? SUB_AREA_OPTIONS[context.supportArea] ?? []
    : [];

  const rows: [string, string][] = [
    ['Grade/Age Band', findLabel(GRADE_BAND_OPTIONS, context.gradeBand)],
    ['Setting', findLabel(SETTING_OPTIONS, context.setting)],
    ['Grouping', findLabel(GROUPING_OPTIONS, context.grouping)],
    ['Time Available', findLabel(TIME_RANGE_OPTIONS, context.timeRange)],
    ['Support Area', findLabel(SUPPORT_AREA_OPTIONS, context.supportArea)],
    ['Sub-Area', findLabel(subAreaOptions, context.subArea)],
    ['Technology', findLabel(TECH_CONTEXT_OPTIONS, context.techContext)],
    [
      'Output Preference',
      findLabel(OUTPUT_PREFERENCE_OPTIONS, context.outputPreference),
    ],
    [
      'Role Perspective',
      findLabel(ROLE_PERSPECTIVE_OPTIONS, context.rolePerspective),
    ],
  ];

  return (
    <div className="export-header mb-8">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">
        EduNavigator — Strategy Report
      </h1>
      <p className="mb-4 text-sm text-neutral-500">
        Generated {new Date(generatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <h2 className="mb-2 text-lg font-semibold text-neutral-800">
        Educator Context
      </h2>
      <table className="w-full text-sm">
        <tbody>
          {rows
            .filter(([, value]) => value !== '—')
            .map(([label, value]) => (
              <tr key={label} className="border-b border-neutral-200">
                <td className="py-1.5 pr-4 font-medium text-neutral-600">
                  {label}
                </td>
                <td className="py-1.5 text-neutral-900">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
