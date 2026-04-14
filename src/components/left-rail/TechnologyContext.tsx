import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { TECH_CONTEXT_OPTIONS } from '../../constants/left-rail-options';
import type { TechContext } from '../../types/left-rail';

export function TechnologyContext({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Available Technology"
      srOnlyLabel={srOnlyLegend}
      options={TECH_CONTEXT_OPTIONS}
      value={state.techContext}
      onChange={(value) =>
        dispatch({ type: 'SET_TECH_CONTEXT', payload: value as TechContext })
      }
      onSelect={onSelect}
    />
  );
}
