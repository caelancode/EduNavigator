import { RadioSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { ROLE_PERSPECTIVE_OPTIONS } from '../../constants/left-rail-options';
import type { RolePerspective as RolePerspectiveType } from '../../types/left-rail';

export function RolePerspective({ srOnlyLegend = false, onSelect }: { srOnlyLegend?: boolean; onSelect?: (value: string) => void }) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Your Role"
      srOnlyLabel={srOnlyLegend}
      options={ROLE_PERSPECTIVE_OPTIONS}
      value={state.rolePerspective}
      onChange={(value) =>
        dispatch({ type: 'SET_ROLE_PERSPECTIVE', payload: value as RolePerspectiveType })
      }
      onSelect={onSelect}
    />
  );
}
