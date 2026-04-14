import { validateStrategies } from '../../src/services/json-validator';
import type { Strategy } from '../../src/types/strategy';

const DELIMITER = '===STRATEGIES_JSON===';

export interface ParseResult {
  chatText: string;
  strategiesRaw: unknown[] | null;
  strategiesValidated: Strategy[];
  hasDelimiter: boolean;
  jsonIsValidArray: boolean;
  strategiesPassZod: boolean;
  parseError?: string;
}

export function parseTestResponse(raw: string): ParseResult {
  if (!raw || !raw.trim()) {
    return {
      chatText: '',
      strategiesRaw: null,
      strategiesValidated: [],
      hasDelimiter: false,
      jsonIsValidArray: false,
      strategiesPassZod: false,
      parseError: 'empty_response',
    };
  }

  const delimiterIndex = raw.indexOf(DELIMITER);

  if (delimiterIndex === -1) {
    return {
      chatText: raw,
      strategiesRaw: null,
      strategiesValidated: [],
      hasDelimiter: false,
      jsonIsValidArray: false,
      strategiesPassZod: false,
      parseError: 'missing_delimiter',
    };
  }

  const chatText = raw.slice(0, delimiterIndex).trim();
  const jsonPayload = raw.slice(delimiterIndex + DELIMITER.length).trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonPayload);
  } catch {
    return {
      chatText,
      strategiesRaw: null,
      strategiesValidated: [],
      hasDelimiter: true,
      jsonIsValidArray: false,
      strategiesPassZod: false,
      parseError: 'invalid_json',
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      chatText,
      strategiesRaw: null,
      strategiesValidated: [],
      hasDelimiter: true,
      jsonIsValidArray: false,
      strategiesPassZod: false,
      parseError: 'not_array',
    };
  }

  const validated = validateStrategies(parsed);

  return {
    chatText,
    strategiesRaw: parsed,
    strategiesValidated: validated,
    hasDelimiter: true,
    jsonIsValidArray: true,
    strategiesPassZod: validated.length > 0 || parsed.length === 0,
  };
}
