import { Dropdown } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { SUB_AREA_OPTIONS } from '../../constants/left-rail-options';

export function SubArea() {
  const { state, dispatch } = useLeftRail();

  if (!state.supportArea || !SUB_AREA_OPTIONS[state.supportArea]) {
    return null;
  }

  return (
    <Dropdown
      label="Sub-Area"
      options={SUB_AREA_OPTIONS[state.supportArea]}
      value={state.subArea}
      onChange={(value) =>
        dispatch({ type: 'SET_SUB_AREA', payload: value })
      }
      placeholder="Select sub-area..."
    />
  );
}
