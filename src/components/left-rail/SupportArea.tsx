import { Dropdown } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { SUPPORT_AREA_OPTIONS } from '../../constants/left-rail-options';

export function SupportArea() {
  const { state, dispatch } = useLeftRail();

  return (
    <Dropdown
      label="Support Area"
      options={SUPPORT_AREA_OPTIONS}
      value={state.supportArea}
      onChange={(value) =>
        dispatch({ type: 'SET_SUPPORT_AREA', payload: value })
      }
      placeholder="Select support area..."
    />
  );
}
