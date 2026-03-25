import { Strategy } from './strategy';
import { LeftRailState } from './left-rail';
import { ChatMessage } from './chat';

export interface ApiRequest {
  projectId: string;
  sessionId: string;
  message: string;
  context: LeftRailState;
  history: ChatMessage[];
}

export type ApiErrorCode =
  | 'network_error'
  | 'timeout'
  | 'missing_delimiter'
  | 'invalid_json'
  | 'not_array'
  | 'schema_violation'
  | 'no_valid_strategies'
  | 'empty_response'
  | 'rate_limited';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  raw?: string;
}

export type ApiResult =
  | { ok: true; chatText: string; strategies: Strategy[] }
  | { ok: false; error: ApiError; chatText?: string };
