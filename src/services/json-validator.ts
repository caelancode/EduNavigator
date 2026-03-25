import { z } from 'zod';
import type { Strategy } from '../types/strategy';

export const StrategySchema = z.object({
  title: z.string().min(1).max(200),
  why_fits: z.string().min(1).max(2000),
  how_to: z.string().min(1).max(5000),
  supporting_excerpt: z.string().min(1).max(2000),
  source_ref: z.string().min(1).max(500),
});

export type StrategyFromSchema = z.infer<typeof StrategySchema>;

export function validateStrategies(parsed: unknown[]): Strategy[] {
  const valid: Strategy[] = [];

  for (const item of parsed) {
    const result = StrategySchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    }
  }

  return valid;
}
