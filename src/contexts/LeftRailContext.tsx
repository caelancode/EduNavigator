import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type {
  LeftRailState,
  LeftRailAction,
  LearnerCharacteristics,
} from '../types/left-rail';

const initialLearnerCharacteristics: LearnerCharacteristics = {
  communicationLevel: [],
  mobilityLevel: [],
  sensoryConsiderations: [],
  behavioralConsiderations: [],
};

export const initialLeftRailState: LeftRailState = {
  gradeBand: null,
  setting: null,
  grouping: null,
  timeRange: null,
  learnerCharacteristics: initialLearnerCharacteristics,
  techContext: null,
  supportArea: null,
  subArea: null,
  outputPreference: null,
  rolePerspective: null,
  stepNotes: {},
  wizardCompleted: false,
  wizardStepIndex: 0,
  recentlyUpdatedFields: new Set(),
  manuallySetFields: new Set(),
  aiInferredFields: new Set(),
};

/** Mark a field as manually set (protected from AI overwrite) and remove from AI-inferred. */
function markManual(state: LeftRailState, field: string): LeftRailState {
  const manuallySetFields = new Set(state.manuallySetFields);
  manuallySetFields.add(field);
  const aiInferredFields = new Set(state.aiInferredFields);
  aiInferredFields.delete(field);
  return { ...state, manuallySetFields, aiInferredFields };
}

export function leftRailReducer(
  state: LeftRailState,
  action: LeftRailAction,
): LeftRailState {
  switch (action.type) {
    case 'SET_GRADE_BAND':
      return markManual({ ...state, gradeBand: action.payload }, 'gradeBand');
    case 'SET_SETTING':
      return markManual({ ...state, setting: action.payload }, 'setting');
    case 'SET_GROUPING':
      return markManual({ ...state, grouping: action.payload }, 'grouping');
    case 'SET_TIME_RANGE':
      return markManual({ ...state, timeRange: action.payload }, 'timeRange');
    case 'SET_LEARNER_CHARACTERISTICS':
      return {
        ...state,
        learnerCharacteristics: {
          ...state.learnerCharacteristics,
          ...action.payload,
        },
      };
    case 'SET_TECH_CONTEXT':
      return markManual({ ...state, techContext: action.payload }, 'techContext');
    case 'SET_SUPPORT_AREA':
      return markManual(
        { ...state, supportArea: action.payload, subArea: null },
        'supportArea',
      );
    case 'SET_SUB_AREA':
      return markManual({ ...state, subArea: action.payload }, 'subArea');
    case 'SET_OUTPUT_PREFERENCE':
      return markManual(
        { ...state, outputPreference: action.payload },
        'outputPreference',
      );
    case 'SET_ROLE_PERSPECTIVE':
      return markManual(
        { ...state, rolePerspective: action.payload },
        'rolePerspective',
      );
    case 'SET_STEP_NOTE': {
      const { stepId, note } = action.payload;
      const next = { ...state.stepNotes };
      if (note.trim()) {
        next[stepId] = note;
      } else {
        delete next[stepId];
      }
      return { ...state, stepNotes: next };
    }
    case 'SET_WIZARD_COMPLETED':
      return { ...state, wizardCompleted: action.payload };
    case 'SET_WIZARD_STEP_INDEX':
      return { ...state, wizardStepIndex: action.payload };
    case 'APPLY_AI_UPDATE': {
      const updates = action.payload;
      const next = { ...state };
      const updatedFields = new Set<string>();
      const aiInferred = new Set(state.aiInferredFields);

      const applyField = <K extends keyof typeof next>(
        field: K,
        value: (typeof next)[K] | undefined,
      ) => {
        if (value === undefined) return;
        if (state.manuallySetFields.has(field as string)) return;
        (next as Record<string, unknown>)[field] = value;
        updatedFields.add(field as string);
        aiInferred.add(field as string);
      };

      applyField('gradeBand', updates.gradeBand);
      applyField('setting', updates.setting);
      applyField('grouping', updates.grouping);
      applyField('timeRange', updates.timeRange);
      applyField('techContext', updates.techContext);
      applyField('outputPreference', updates.outputPreference);
      applyField('rolePerspective', updates.rolePerspective);

      // Support area: clear subArea if supportArea changes and subArea not also in update
      if (
        updates.supportArea !== undefined &&
        !state.manuallySetFields.has('supportArea')
      ) {
        if (
          updates.supportArea !== state.supportArea &&
          updates.subArea === undefined
        ) {
          next.subArea = null;
        }
        next.supportArea = updates.supportArea;
        updatedFields.add('supportArea');
        aiInferred.add('supportArea');
      }
      applyField('subArea', updates.subArea);

      return {
        ...next,
        recentlyUpdatedFields: updatedFields,
        aiInferredFields: aiInferred,
      };
    }
    case 'CLEAR_FIELD_HIGHLIGHTS':
      return { ...state, recentlyUpdatedFields: new Set() };
    case 'RESTORE':
      return {
        ...action.payload,
        wizardCompleted: true,
        recentlyUpdatedFields: new Set(),
        manuallySetFields: new Set(),
        aiInferredFields: new Set(),
      };
    case 'RESET':
      return initialLeftRailState;
  }
}

interface LeftRailContextValue {
  state: LeftRailState;
  dispatch: Dispatch<LeftRailAction>;
}

const LeftRailContext = createContext<LeftRailContextValue | null>(null);

export function LeftRailProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(leftRailReducer, initialLeftRailState);

  return (
    <LeftRailContext.Provider value={{ state, dispatch }}>
      {children}
    </LeftRailContext.Provider>
  );
}

export function useLeftRail(): LeftRailContextValue {
  const context = useContext(LeftRailContext);
  if (!context) {
    throw new Error('useLeftRail must be used within a LeftRailProvider');
  }
  return context;
}
