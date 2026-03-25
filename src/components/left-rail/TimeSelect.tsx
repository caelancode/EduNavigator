import { Dropdown } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { TIME_RANGE_OPTIONS } from '../../constants/left-rail-options';
import type { TimeRange } from '../../types/left-rail';

export function TimeSelect() {
  const { state, dispatch } = useLeftRail();

  return (
    <Dropdown
      label="Time Available"
      options={TIME_RANGE_OPTIONS}
      value={state.timeRange}
      onChange={(value) =>
        dispatch({ type: 'SET_TIME_RANGE', payload: value as TimeRange })
      }
      placeholder="Select time range..."
    />
  );
}
