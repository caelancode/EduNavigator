export type GradeBand = 'prek_2' | '3_5' | '6_8' | '9_12' | '18_22';
export type Setting =
  | 'general_ed'
  | 'resource_room'
  | 'self_contained'
  | 'community'
  | 'home'
  | 'other';
export type Grouping = 'one_on_one' | 'small_group' | 'whole_class' | 'mixed';
export type TimeRange = '5_10' | '11_20' | '21_30' | '31_45' | '46_plus';
export type TechContext = 'no_tech' | 'minimal_tech' | 'specialized_tech';
export type OutputPreference =
  | 'step_by_step'
  | 'scripts'
  | 'quick_ideas'
  | 'rationale';
export type RolePerspective =
  | 'classroom_teacher'
  | 'special_educator'
  | 'related_services'
  | 'paraprofessional'
  | 'admin'
  | 'other';

export interface LearnerCharacteristics {
  communicationLevel: string[];
  mobilityLevel: string[];
  sensoryConsiderations: string[];
  behavioralConsiderations: string[];
}

export interface LeftRailState {
  gradeBand: GradeBand | null;
  setting: Setting | null;
  grouping: Grouping | null;
  timeRange: TimeRange | null;
  learnerCharacteristics: LearnerCharacteristics;
  techContext: TechContext | null;
  supportArea: string | null;
  subArea: string | null;
  outputPreference: OutputPreference | null;
  rolePerspective: RolePerspective | null;
  /** Per-field free-text notes (keyed by step ID) */
  stepNotes: Record<string, string>;
  /** AI-generated summary of conversational context that doesn't map to structured fields */
  contextNotes: string;
  /** Whether the setup wizard has been completed this session */
  wizardCompleted: boolean;
  /** Index of the currently active wizard step in the chat area */
  wizardStepIndex: number;
  /** Fields recently updated by AI — used for highlight animation (transient, never persisted) */
  recentlyUpdatedFields: ReadonlySet<string>;
  /** Fields manually set via the left rail form — protected from AI overwrite (session-scoped) */
  manuallySetFields: ReadonlySet<string>;
  /** Fields set by AI inference — shown with "inferred" indicator in UI (session-scoped) */
  aiInferredFields: ReadonlySet<string>;
}

import type { AIContextUpdates } from './context-update';

export type LeftRailAction =
  | { type: 'SET_GRADE_BAND'; payload: GradeBand }
  | { type: 'SET_SETTING'; payload: Setting }
  | { type: 'SET_GROUPING'; payload: Grouping }
  | { type: 'SET_TIME_RANGE'; payload: TimeRange }
  | {
      type: 'SET_LEARNER_CHARACTERISTICS';
      payload: Partial<LearnerCharacteristics>;
    }
  | { type: 'SET_TECH_CONTEXT'; payload: TechContext }
  | { type: 'SET_SUPPORT_AREA'; payload: string }
  | { type: 'SET_SUB_AREA'; payload: string }
  | { type: 'SET_OUTPUT_PREFERENCE'; payload: OutputPreference }
  | { type: 'SET_ROLE_PERSPECTIVE'; payload: RolePerspective }
  | { type: 'SET_STEP_NOTE'; payload: { stepId: string; note: string } }
  | { type: 'SET_WIZARD_COMPLETED'; payload: boolean }
  | { type: 'SET_WIZARD_STEP_INDEX'; payload: number }
  | { type: 'APPLY_AI_UPDATE'; payload: AIContextUpdates }
  | { type: 'CLEAR_FIELD_HIGHLIGHTS' }
  | { type: 'RESTORE'; payload: LeftRailState }
  | { type: 'RESET' };
