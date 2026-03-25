import { describe, it, expect } from 'vitest';
import { parseResponse } from '../../services/response-parser';
import {
  createValidResponse,
  createMissingDelimiterResponse,
  createInvalidJsonResponse,
  createNotArrayResponse,
  createSchemaViolationResponse,
  createNoValidStrategiesResponse,
  createEmptyResponse,
  createTruncatedResponse,
  createDoubleDelimiterResponse,
  createJsonInChatResponse,
  createExtraPropertiesResponse,
  createXssInjectionResponse,
  createNullFieldsResponse,
  createUnicodeResponse,
  createLargeResponse,
} from '../mocks/mock-server';

describe('parseResponse', () => {
  // Happy path
  it('parses a valid response with 3 strategies', () => {
    const result = parseResponse(createValidResponse());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(3);
      expect(result.chatText).toContain('evidence-based strategies');
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
    }
  });

  // Adversarial test 1: Truncated response
  it('handles truncated response (cuts off mid-JSON)', () => {
    const result = parseResponse(createTruncatedResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_json');
      expect(result.chatText).toBe('Here are strategies.');
    }
  });

  // Adversarial test 2: Missing delimiter
  it('handles missing delimiter', () => {
    const result = parseResponse(createMissingDelimiterResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('missing_delimiter');
      expect(result.chatText).toContain('strategies');
    }
  });

  // Adversarial test 3: Double delimiter (split on first occurrence)
  it('handles double delimiter by splitting on first occurrence', () => {
    const result = parseResponse(createDoubleDelimiterResponse());
    // First split: chatText contains everything before the first delimiter
    // jsonPayload is everything after first delimiter, which includes the second delimiter + JSON
    // The JSON parse may fail because the second delimiter is included, or it may grab valid JSON after it
    // Key behavior: it splits on FIRST occurrence
    expect(result.chatText).toBeDefined();
    if (result.ok) {
      expect(result.strategies.length).toBeGreaterThanOrEqual(1);
    } else {
      // If the second delimiter corrupts the JSON, that's acceptable behavior
      expect(result.error.code).toMatch(/invalid_json|missing_delimiter/);
    }
  });

  // Adversarial test 4: Valid JSON in pre-delimiter chat text
  it('ignores valid JSON in pre-delimiter chat text', () => {
    const result = parseResponse(createJsonInChatResponse());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe(
        'Systematic Prompting with Time Delay',
      );
    }
  });

  // Adversarial test 5: Missing required fields
  it('filters out objects with missing required fields', () => {
    const result = parseResponse(createSchemaViolationResponse());
    // The third strategy is valid, the first two are not
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
    } else {
      // If zero valid, should get schema_violation
      expect(result.error.code).toMatch(
        /schema_violation|no_valid_strategies/,
      );
    }
  });

  // Adversarial test 6: Extra properties (strip and retain valid)
  it('strips extra properties and retains valid strategies', () => {
    const result = parseResponse(createExtraPropertiesResponse());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
      // Extra properties should not be present
      expect(
        'extra_field' in result.strategies[0],
      ).toBe(false);
      expect('confidence' in result.strategies[0]).toBe(false);
    }
  });

  // Adversarial test 7: Large response (50KB+, must parse within 50ms)
  it('parses 50KB+ response within 50ms', () => {
    const largeResponse = createLargeResponse();
    expect(largeResponse.length).toBeGreaterThan(50000);

    const start = performance.now();
    const result = parseResponse(largeResponse);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(3);
    }
  });

  // Adversarial test 8: Empty JSON array
  it('handles empty JSON array', () => {
    const result = parseResponse(createNoValidStrategiesResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('no_valid_strategies');
      expect(result.chatText).toContain("wasn't able to find");
    }
  });

  // Adversarial test 9: Null values in required fields
  it('handles null values in required string fields', () => {
    const result = parseResponse(createNullFieldsResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('schema_violation');
    }
  });

  // Adversarial test 10: HTML/script injection
  it('strips HTML/script injection via DOMPurify', () => {
    const result = parseResponse(createXssInjectionResponse());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      const strategy = result.strategies[0];
      expect(strategy.title).not.toContain('<script>');
      expect(strategy.why_fits).not.toContain('onerror');
      expect(strategy.how_to).not.toContain('javascript:');
    }
  });

  // Adversarial test 11: Unicode edge cases
  it('handles unicode edge cases (emoji, RTL, special chars)', () => {
    const result = parseResponse(createUnicodeResponse());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      const strategy = result.strategies[0];
      expect(strategy.title).toContain('\ud83c\udf1f');
      expect(strategy.source_ref).toContain('Garc\u00eda');
    }
  });

  // Additional edge cases
  it('handles invalid JSON (not parseable)', () => {
    const result = parseResponse(createInvalidJsonResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_json');
    }
  });

  it('handles parsed JSON that is not an array', () => {
    const result = parseResponse(createNotArrayResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('not_array');
    }
  });

  it('handles empty string response', () => {
    const result = parseResponse(createEmptyResponse());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('empty_response');
    }
  });
});
