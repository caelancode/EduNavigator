import { describe, it, expect } from 'vitest';
import { buildApiRequest } from '../../services/request-builder';
import { initialLeftRailState } from '../../contexts/LeftRailContext';

describe('buildApiRequest', () => {
  it('builds a valid request with context', () => {
    const result = buildApiRequest(
      { ...initialLeftRailState, gradeBand: '3_5', setting: 'general_ed' },
      'Help me find strategies',
      [],
      'session-123',
    );

    expect(result.sessionId).toBe('session-123');
    expect(result.message).toBe('Help me find strategies');
    expect(result.context.gradeBand).toBe('3_5');
    expect(result.history).toHaveLength(0);
  });

  it('trims and limits message to 2000 characters', () => {
    const longMessage = '  ' + 'x'.repeat(2500) + '  ';
    const result = buildApiRequest(
      initialLeftRailState,
      longMessage,
      [],
      's1',
    );
    expect(result.message.length).toBeLessThanOrEqual(2000);
    expect(result.message.startsWith('x')).toBe(true);
  });

  it('strips control characters from message', () => {
    const result = buildApiRequest(
      initialLeftRailState,
      'Hello\x00World\x1F!',
      [],
      's1',
    );
    expect(result.message).toBe('HelloWorld!');
  });

  it('includes chat history', () => {
    const history = [
      {
        id: '1',
        role: 'user' as const,
        content: 'Previous message',
        timestamp: 1000,
      },
    ];
    const result = buildApiRequest(
      initialLeftRailState,
      'New message',
      history,
      's1',
    );
    expect(result.history).toHaveLength(1);
    expect(result.history[0].content).toBe('Previous message');
  });
});
