import { describe, it, expect } from 'vitest';
import { StrategySchema, validateStrategies } from '../../services/json-validator';

const validStrategy = {
  title: 'Test Strategy',
  why_fits: 'Because it works well',
  how_to: 'Step 1: Do this',
  supporting_excerpt: 'Research shows...',
  source_ref: 'Author (2024). Title.',
};

describe('StrategySchema', () => {
  it('accepts a valid strategy object', () => {
    const result = StrategySchema.safeParse(validStrategy);
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = StrategySchema.safeParse({ ...validStrategy, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects title exceeding max length', () => {
    const result = StrategySchema.safeParse({
      ...validStrategy,
      title: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('rejects null fields', () => {
    const result = StrategySchema.safeParse({ ...validStrategy, title: null });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const incomplete = { ...validStrategy };
    delete (incomplete as Record<string, unknown>).title;
    const result = StrategySchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('strips extra properties', () => {
    const result = StrategySchema.safeParse({
      ...validStrategy,
      extra: 'should be stripped',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('extra' in result.data).toBe(false);
    }
  });
});

describe('validateStrategies', () => {
  it('returns valid strategies from a mixed array', () => {
    const items = [
      validStrategy,
      { title: '' },
      { ...validStrategy, title: 'Second Valid' },
    ];
    const result = validateStrategies(items);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Test Strategy');
    expect(result[1].title).toBe('Second Valid');
  });

  it('returns empty array when all items are invalid', () => {
    const items = [{ title: '' }, { bad: 'data' }];
    const result = validateStrategies(items);
    expect(result).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    const result = validateStrategies([]);
    expect(result).toHaveLength(0);
  });
});
