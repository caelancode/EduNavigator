import { CollapsibleSection, RadioGroup } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { ROLE_PERSPECTIVE_OPTIONS } from '../../constants/left-rail-options';
import type { RolePerspective as RolePerspectiveType } from '../../types/left-rail';

export function RolePerspective() {
  const { state, dispatch } = useLeftRail();

  return (
    <CollapsibleSection title="Role Perspective">
      <RadioGroup
        legend="Your Role"
        name="role-perspective"
        options={ROLE_PERSPECTIVE_OPTIONS}
        value={state.rolePerspective}
        onChange={(value) =>
          dispatch({
            type: 'SET_ROLE_PERSPECTIVE',
            payload: value as RolePerspectiveType,
          })
        }
      />
    </CollapsibleSection>
  );
}
