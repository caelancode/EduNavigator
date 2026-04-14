import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { GROUPING_OPTIONS } from '../../constants/left-rail-options';
import type { Grouping } from '../../types/left-rail';

export function GroupingSelect({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Grouping"
      srOnlyLabel={srOnlyLegend}
      options={GROUPING_OPTIONS}
      value={state.grouping}
      onChange={(value) =>
        dispatch({ type: 'SET_GROUPING', payload: value as Grouping })
      }
      onSelect={onSelect}
    />
  );
}
