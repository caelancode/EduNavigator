import { useLeftRail } from '../../contexts/LeftRailContext';
import { SUPPORT_AREA_OPTIONS } from '../../constants/left-rail-options';
import { RadioSelect } from '../ui';

export function SupportArea({
  srOnlyLegend,
  onSelect,
}: {
  srOnlyLegend?: boolean;
  onSelect?: (value: string) => void;
}) {
  const { state, dispatch } = useLeftRail();

  return (
    <RadioSelect
      groupLabel="Support focus"
      srOnlyLabel={srOnlyLegend}
      options={SUPPORT_AREA_OPTIONS}
      value={state.supportArea}
      onChange={(value) => dispatch({ type: 'SET_SUPPORT_AREA', payload: value })}
      onSelect={onSelect}
    />
  );
}
