export type ConversationPhase =
  | 'idle'
  | 'reflection'
  | 'elaboration'
  | 'research'
  | 'exploration';

export interface CitationLink {
  /** Citation number as displayed in chat text, e.g., 1 for [1] */
  citationNumber: number;
  /** 0-indexed position in the strategies array */
  strategyIndex: number;
  /** ID of the chat message containing this citation */
  messageId: string;
}
