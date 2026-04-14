import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { OUTPUT_PREFERENCE_OPTIONS } from '../../constants/left-rail-options';
import type { OutputPreference } from '../../types/left-rail';

export function OutputPreferences({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Strategy Format"
      srOnlyLabel={srOnlyLegend}
      options={OUTPUT_PREFERENCE_OPTIONS}
      value={state.outputPreference}
      onChange={(value) =>
        dispatch({ type: 'SET_OUTPUT_PREFERENCE', payload: value as OutputPreference })
      }
      onSelect={onSelect}
    />
  );
}
