import type {
  GradeBand,
  Setting,
  Grouping,
  TimeRange,
  TechContext,
  OutputPreference,
  RolePerspective,
} from './left-rail';

/**
 * Partial representation of left-rail fields the AI can extract from conversation.
 * learnerCharacteristics is deliberately excluded — too sensitive to infer silently.
 */
export interface AIContextUpdates {
  gradeBand?: GradeBand;
  setting?: Setting;
  grouping?: Grouping;
  timeRange?: TimeRange;
  techContext?: TechContext;
  supportArea?: string;
  subArea?: string;
  outputPreference?: OutputPreference;
  rolePerspective?: RolePerspective;
  /** Free-text summary of conversational details that don't map to structured fields
   *  (e.g., specific diagnoses, activities, challenges, student interests). */
  contextNotes?: string;
}

/**
 * An optional follow-up question the AI wants to ask, with pre-defined options.
 * The frontend renders these as clickable chips below the message.
 */
export interface NextQuestion {
  /** Which left-rail field this question is about */
  field: string;
  /** The question text (also appears in the chat prose) */
  text: string;
  /** Enum values — the frontend looks up human-readable labels */
  options: string[];
  /** True if this question is from the local guided intake (not AI-generated) */
  isLocal?: boolean;
}

/**
 * Structured context extracted from an AI response via ===CONTEXT_UPDATE===.
 * Strictly optional — its absence is never an error.
 */
export interface ContextUpdate {
  updates: AIContextUpdates;
  nextQuestion?: NextQuestion;
}
