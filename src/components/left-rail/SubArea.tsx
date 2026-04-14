import { useLeftRail } from '../../contexts/LeftRailContext';
import { SUB_AREA_OPTIONS, SUPPORT_AREA_OPTIONS } from '../../constants/left-rail-options';
import { RadioSelect } from '../ui';

export function SubArea({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  if (!state.supportArea || !SUB_AREA_OPTIONS[state.supportArea]) {
    return null;
  }

  const supportLabel = SUPPORT_AREA_OPTIONS.find((o) => o.value === state.supportArea)?.label ?? 'Support Area';

  return (
    <RadioSelect
      groupLabel={`Focus Within ${supportLabel}`}
      srOnlyLabel={srOnlyLegend}
      options={SUB_AREA_OPTIONS[state.supportArea]}
      value={state.subArea}
      onChange={(value) =>
        dispatch({ type: 'SET_SUB_AREA', payload: value })
      }
      onSelect={onSelect}
    />
  );
}
