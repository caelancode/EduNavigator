import { CollapsibleSection, MultiSelect } from '../ui';
import { useLeftRail } from '../../contexts/LeftRailContext';
import {
  COMMUNICATION_LEVEL_OPTIONS,
  MOBILITY_LEVEL_OPTIONS,
  SENSORY_OPTIONS,
  BEHAVIORAL_OPTIONS,
} from '../../constants/left-rail-options';

export function LearnerCharacteristics() {
  const { state, dispatch } = useLeftRail();
  const { learnerCharacteristics } = state;

  const totalSelected = [
    ...learnerCharacteristics.communicationLevel,
    ...learnerCharacteristics.mobilityLevel,
    ...learnerCharacteristics.sensoryConsiderations,
    ...learnerCharacteristics.behavioralConsiderations,
  ].length;

  return (
    <CollapsibleSection title="Learner Characteristics" badge={totalSelected > 0 ? `${totalSelected} selected` : undefined}>
      <div className="space-y-4">
        <MultiSelect
          legend="Communication Level"
          options={COMMUNICATION_LEVEL_OPTIONS}
          selectedValues={learnerCharacteristics.communicationLevel}
          onChange={(values) =>
            dispatch({
              type: 'SET_LEARNER_CHARACTERISTICS',
              payload: { communicationLevel: values },
            })
          }
        />
        <MultiSelect
          legend="Mobility Level"
          options={MOBILITY_LEVEL_OPTIONS}
          selectedValues={learnerCharacteristics.mobilityLevel}
          onChange={(values) =>
            dispatch({
              type: 'SET_LEARNER_CHARACTERISTICS',
              payload: { mobilityLevel: values },
            })
          }
        />
        <MultiSelect
          legend="Sensory Considerations"
          options={SENSORY_OPTIONS}
          selectedValues={learnerCharacteristics.sensoryConsiderations}
          onChange={(values) =>
            dispatch({
              type: 'SET_LEARNER_CHARACTERISTICS',
              payload: { sensoryConsiderations: values },
            })
          }
        />
        <MultiSelect
          legend="Behavioral Considerations"
          options={BEHAVIORAL_OPTIONS}
          selectedValues={learnerCharacteristics.behavioralConsiderations}
          onChange={(values) =>
            dispatch({
              type: 'SET_LEARNER_CHARACTERISTICS',
              payload: { behavioralConsiderations: values },
            })
          }
        />
      </div>
    </CollapsibleSection>
  );
}
