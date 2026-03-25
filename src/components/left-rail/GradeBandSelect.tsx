import { Dropdown } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { GRADE_BAND_OPTIONS } from '../../constants/left-rail-options';
import type { GradeBand } from '../../types/left-rail';

export function GradeBandSelect() {
  const { state, dispatch } = useLeftRail();

  return (
    <Dropdown
      label="Grade/Age Band"
      options={GRADE_BAND_OPTIONS}
      value={state.gradeBand}
      onChange={(value) =>
        dispatch({ type: 'SET_GRADE_BAND', payload: value as GradeBand })
      }
      placeholder="Select grade band..."
    />
  );
}
