import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { GRADE_BAND_OPTIONS } from '../../constants/left-rail-options';
import type { GradeBand } from '../../types/left-rail';

export function GradeBandSelect({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Grade or Age Band"
      srOnlyLabel={srOnlyLegend}
      options={GRADE_BAND_OPTIONS}
      value={state.gradeBand}
      onChange={(value) =>
        dispatch({ type: 'SET_GRADE_BAND', payload: value as GradeBand })
      }
      onSelect={onSelect}
    />
  );
}
