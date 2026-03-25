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
};

export function leftRailReducer(
  state: LeftRailState,
  action: LeftRailAction,
): LeftRailState {
  switch (action.type) {
    case 'SET_GRADE_BAND':
      return { ...state, gradeBand: action.payload };
    case 'SET_SETTING':
      return { ...state, setting: action.payload };
    case 'SET_GROUPING':
      return { ...state, grouping: action.payload };
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    case 'SET_LEARNER_CHARACTERISTICS':
      return {
        ...state,
        learnerCharacteristics: {
          ...state.learnerCharacteristics,
          ...action.payload,
        },
      };
    case 'SET_TECH_CONTEXT':
      return { ...state, techContext: action.payload };
    case 'SET_SUPPORT_AREA':
      return { ...state, supportArea: action.payload, subArea: null };
    case 'SET_SUB_AREA':
      return { ...state, subArea: action.payload };
    case 'SET_OUTPUT_PREFERENCE':
      return { ...state, outputPreference: action.payload };
    case 'SET_ROLE_PERSPECTIVE':
      return { ...state, rolePerspective: action.payload };
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
