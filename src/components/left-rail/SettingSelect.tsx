import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { SETTING_OPTIONS } from '../../constants/left-rail-options';
import type { Setting } from '../../types/left-rail';

export function SettingSelect({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Setting"
      srOnlyLabel={srOnlyLegend}
      options={SETTING_OPTIONS}
      value={state.setting}
      onChange={(value) =>
        dispatch({ type: 'SET_SETTING', payload: value as Setting })
      }
      onSelect={onSelect}
    />
  );
}
