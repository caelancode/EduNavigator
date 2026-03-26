import { CollapsibleSection, RadioGroup } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { OUTPUT_PREFERENCE_OPTIONS } from '../../constants/left-rail-options';
import type { OutputPreference } from '../../types/left-rail';

export function OutputPreferences() {
  const { state, dispatch } = useLeftRail();
  const selectedLabel = OUTPUT_PREFERENCE_OPTIONS.find((o) => o.value === state.outputPreference)?.label;

  return (
    <CollapsibleSection title="Output Preferences" badge={selectedLabel}>
      <RadioGroup
        legend="Preferred Output"
        name="output-preference"
        options={OUTPUT_PREFERENCE_OPTIONS}
        value={state.outputPreference}
        onChange={(value) =>
          dispatch({
            type: 'SET_OUTPUT_PREFERENCE',
            payload: value as OutputPreference,
          })
        }
      />
    </CollapsibleSection>
  );
}
