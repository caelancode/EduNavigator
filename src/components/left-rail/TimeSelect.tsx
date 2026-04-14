import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { TIME_RANGE_OPTIONS } from '../../constants/left-rail-options';
import type { TimeRange } from '../../types/left-rail';

export function TimeSelect({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="How Much Time?"
      srOnlyLabel={srOnlyLegend}
      options={TIME_RANGE_OPTIONS}
      value={state.timeRange}
      onChange={(value) =>
        dispatch({ type: 'SET_TIME_RANGE', payload: value as TimeRange })
      }
      onSelect={onSelect}
    />
  );
}
