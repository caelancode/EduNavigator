import type { CitationLink } from './cross-reference';
import type { NextQuestion } from './context-update';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface SuggestionChip {
  id: string;
  /** Display label shown on the chip button */
  label: string;
  /** The message text sent to the chat when this chip is clicked */
  message: string;
}

export type IntakeStage = 'landing' | 'sub_area' | 'other_elaboration' | 'grade_band' | 'confirm' | 'complete';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  hidden?: boolean;
  /** True for locally-generated guided intake messages (not sent to API) */
  local?: boolean;
  /** Citation links extracted from this message's content (assistant messages only) */
  citations?: CitationLink[];
  /** Strategy generation counter at the time this message was created */
  strategyGeneration?: number;
  /** Follow-up question with clickable options */
  nextQuestion?: NextQuestion;
  /** Prominent action button (e.g., "Find Strategies") */
  actionButton?: { label: string };
  /** Action chips shown after strategy-bearing responses to guide the next step */
  suggestionChips?: SuggestionChip[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  intakeStage: IntakeStage;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'REMOVE_MESSAGE'; payload: string }
  | { type: 'SET_INTAKE_STAGE'; payload: IntakeStage };
