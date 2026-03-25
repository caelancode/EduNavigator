import DOMPurify from 'dompurify';
import type { ApiResult } from '../types/api';
import type { Strategy } from '../types/strategy';
import { validateStrategies } from './json-validator';

const DELIMITER = '===STRATEGIES_JSON===';

function sanitizeStrategy(strategy: Strategy): Strategy {
  return {
    title: DOMPurify.sanitize(strategy.title),
    why_fits: DOMPurify.sanitize(strategy.why_fits),
    how_to: DOMPurify.sanitize(strategy.how_to),
    supporting_excerpt: DOMPurify.sanitize(strategy.supporting_excerpt),
    source_ref: DOMPurify.sanitize(strategy.source_ref),
  };
}

export function parseResponse(raw: string): ApiResult {
  // Step 1: Check for empty response
  if (!raw || raw.trim().length === 0) {
    return {
      ok: false,
      error: {
        code: 'empty_response',
        message: 'No response received from the server.',
      },
    };
  }

  // Step 2: Find delimiter (first occurrence)
  const delimiterIndex = raw.indexOf(DELIMITER);

  if (delimiterIndex === -1) {
    return {
      ok: false,
      error: {
        code: 'missing_delimiter',
        message: 'Response format was unexpected. Strategies unavailable.',
        raw,
      },
      chatText: raw.trim(),
    };
  }

  // Step 3: Split
  const chatText = raw.substring(0, delimiterIndex).trim();
  const jsonPayload = raw.substring(delimiterIndex + DELIMITER.length).trim();

  // Step 4: JSON.parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonPayload);
  } catch {
    return {
      ok: false,
      error: {
        code: 'invalid_json',
        message: 'Could not parse strategy data.',
        raw: jsonPayload,
      },
      chatText,
    };
  }

  // Step 5: Array check
  if (!Array.isArray(parsed)) {
    return {
      ok: false,
      error: {
        code: 'not_array',
        message: 'Strategy data was not in the expected format.',
        raw: jsonPayload,
      },
      chatText,
    };
  }

  // Step 6: Schema validation
  const validStrategies = validateStrategies(parsed);

  if (validStrategies.length === 0 && parsed.length > 0) {
    return {
      ok: false,
      error: {
        code: 'schema_violation',
        message: 'Strategy data did not match the expected schema.',
        raw: jsonPayload,
      },
      chatText,
    };
  }

  if (validStrategies.length === 0) {
    return {
      ok: false,
      error: {
        code: 'no_valid_strategies',
        message: 'No matching strategies found for your current context.',
      },
      chatText,
    };
  }

  // Step 7: Sanitize
  const sanitized = validStrategies.map(sanitizeStrategy);

  // Step 8: Return
  return {
    ok: true,
    chatText,
    strategies: sanitized,
  };
}
