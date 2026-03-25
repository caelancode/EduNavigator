import { Dropdown } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { SETTING_OPTIONS } from '../../constants/left-rail-options';
import type { Setting } from '../../types/left-rail';

export function SettingSelect() {
  const { state, dispatch } = useLeftRail();

  return (
    <Dropdown
      label="Setting"
      options={SETTING_OPTIONS}
      value={state.setting}
      onChange={(value) =>
        dispatch({ type: 'SET_SETTING', payload: value as Setting })
      }
      placeholder="Select setting..."
    />
  );
}
