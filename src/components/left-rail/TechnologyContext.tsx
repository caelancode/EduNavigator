import { CollapsibleSection, RadioGroup } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { TECH_CONTEXT_OPTIONS } from '../../constants/left-rail-options';
import type { TechContext } from '../../types/left-rail';

export function TechnologyContext() {
  const { state, dispatch } = useLeftRail();

  return (
    <CollapsibleSection title="Technology Context">
      <RadioGroup
        legend="Available Technology"
        name="tech-context"
        options={TECH_CONTEXT_OPTIONS}
        value={state.techContext}
        onChange={(value) =>
          dispatch({ type: 'SET_TECH_CONTEXT', payload: value as TechContext })
        }
      />
    </CollapsibleSection>
  );
}
