import { RadioGroup } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { GROUPING_OPTIONS } from '../../constants/left-rail-options';
import type { Grouping } from '../../types/left-rail';

export function GroupingSelect() {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioGroup
      legend="Grouping"
      name="grouping"
      options={GROUPING_OPTIONS}
      value={state.grouping}
      onChange={(value) =>
        dispatch({ type: 'SET_GROUPING', payload: value as Grouping })
      }
      variant="pills"
    />
  );
}
