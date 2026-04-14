import DOMPurify from 'dompurify';
import type { ApiResult } from '../types/api';
import type { Strategy, SourceReference } from '../types/strategy';
import type { ContextUpdate } from '../types/context-update';
import { validateStrategies } from './json-validator';
import { validateContextUpdate } from './context-update-validator';

const DELIMITER = '===STRATEGIES_JSON===';
const CONTEXT_DELIMITER = '===CONTEXT_UPDATE===';

/**
 * Strip stray delimiter-like markers (e.g. trailing "===") that the AI sometimes
 * adds around JSON blocks. Only removes lines that are purely "=" characters.
 */
function cleanJsonPayload(payload: string): string {
  return payload
    .split('\n')
    .filter((line) => !/^=+\s*$/.test(line.trim()))
    .join('\n')
    .trim();
}

function sanitizeSource(source: SourceReference): SourceReference {
  const sanitized: SourceReference = {
    formatted: DOMPurify.sanitize(source.formatted),
  };
  if (source.authors) sanitized.authors = DOMPurify.sanitize(source.authors);
  if (source.year) sanitized.year = DOMPurify.sanitize(source.year);
  if (source.title) sanitized.title = DOMPurify.sanitize(source.title);
  if (source.publication)
    sanitized.publication = DOMPurify.sanitize(source.publication);
  if (source.location) sanitized.location = DOMPurify.sanitize(source.location);
  return sanitized;
}

function sanitizeStrategy(strategy: Strategy): Strategy {
  const sanitized: Strategy = {
    title: DOMPurify.sanitize(strategy.title),
    context_tagline: DOMPurify.sanitize(strategy.context_tagline),
    quick_version: DOMPurify.sanitize(strategy.quick_version),
    why_fits: DOMPurify.sanitize(strategy.why_fits),
    supporting_excerpt: DOMPurify.sanitize(strategy.supporting_excerpt),
    source_ref: DOMPurify.sanitize(strategy.source_ref),
    source: sanitizeSource(strategy.source),
  };
  if (strategy.how_to !== undefined) {
    sanitized.how_to = DOMPurify.sanitize(strategy.how_to);
  }
  if (strategy.steps !== undefined) {
    sanitized.steps = {
      prep: strategy.steps.prep.map((s) => DOMPurify.sanitize(s)),
      during: strategy.steps.during.map((s) => DOMPurify.sanitize(s)),
      follow_up: strategy.steps.follow_up.map((s) => DOMPurify.sanitize(s)),
    };
  }
  return sanitized;
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

  // Step 3: Split — separate chat text from everything after the first delimiter
  const chatText = raw.substring(0, delimiterIndex).trim();
  const afterFirstDelimiter = raw.substring(delimiterIndex + DELIMITER.length).trim();

  // Step 3b: Check for optional ===CONTEXT_UPDATE=== within the post-delimiter payload
  let strategiesPayload: string;
  let contextUpdate: ContextUpdate | undefined;

  const contextDelimiterIndex = afterFirstDelimiter.indexOf(CONTEXT_DELIMITER);
  if (contextDelimiterIndex !== -1) {
    strategiesPayload = cleanJsonPayload(
      afterFirstDelimiter.substring(0, contextDelimiterIndex),
    );
    const contextPayload = cleanJsonPayload(
      afterFirstDelimiter.substring(contextDelimiterIndex + CONTEXT_DELIMITER.length),
    );

    // Parse context update independently — failure never affects strategies
    try {
      const contextParsed: unknown = JSON.parse(contextPayload);
      const validated = validateContextUpdate(contextParsed);
      if (validated) {
        contextUpdate = validated;
      }
    } catch {
      // Malformed context update JSON — silently ignore
      if (import.meta.env.DEV) {
        console.warn('[parseResponse] Malformed ===CONTEXT_UPDATE=== JSON:', contextPayload);
      }
    }
  } else {
    strategiesPayload = cleanJsonPayload(afterFirstDelimiter);
  }

  // Step 4: JSON.parse the strategies payload
  let parsed: unknown;
  try {
    parsed = JSON.parse(strategiesPayload);
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error('[parseResponse] Strategy JSON parse failed.');
      console.error('[parseResponse] strategiesPayload:', strategiesPayload.slice(0, 500));
      console.error('[parseResponse] Error:', e);
      console.error('[parseResponse] Full afterFirstDelimiter:', afterFirstDelimiter.slice(0, 800));
    }
    return {
      ok: false,
      error: {
        code: 'invalid_json',
        message: 'Could not parse strategy data.',
        raw: strategiesPayload,
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
        raw: strategiesPayload,
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
        raw: strategiesPayload,
      },
      chatText,
    };
  }

  // Intentionally empty array (exploratory turn) — return ok with no strategies
  if (parsed.length === 0) {
    return {
      ok: true,
      chatText,
      strategies: [],
      contextUpdate,
    };
  }

  // Had items but none passed validation — genuine schema issue
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
    contextUpdate,
  };
}
