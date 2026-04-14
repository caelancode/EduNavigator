import { z } from 'zod';
import type { Strategy } from '../types/strategy';

const SourceReferenceSchema = z.object({
  formatted: z.string().min(1).max(500),
  authors: z.string().max(200).optional(),
  year: z.string().max(10).optional(),
  title: z.string().max(300).optional(),
  publication: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
});

const StepsSchema = z.object({
  prep: z.array(z.string().max(500)).default([]),
  during: z.array(z.string().max(500)).default([]),
  follow_up: z.array(z.string().max(500)).default([]),
});

/**
 * Accepts both the new structured format (with `steps`, `context_tagline`, `quick_version`)
 * and the legacy format (with only `how_to`).
 * Normalizes output so all fields are always present.
 */
const RawStrategySchema = z.object({
  title: z.string().min(1).max(200),
  context_tagline: z.string().max(300).optional(),
  quick_version: z.string().max(500).optional(),
  steps: StepsSchema.optional(),
  why_fits: z.string().min(1).max(2000),
  how_to: z.string().min(1).max(5000).optional(),
  supporting_excerpt: z.string().min(1).max(2000),
  source_ref: z.string().min(1).max(500).optional(),
  source: SourceReferenceSchema.optional(),
}).refine(
  (data) => data.source !== undefined || data.source_ref !== undefined,
  { message: 'Either source or source_ref must be provided' },
).refine(
  (data) => data.steps !== undefined || data.how_to !== undefined,
  { message: 'Either steps or how_to must be provided' },
);

export const StrategySchema = RawStrategySchema;

export type StrategyFromSchema = z.infer<typeof RawStrategySchema>;

/**
 * Extract the first sentence from a string (ends at first '. ', '! ', or '? ').
 * Falls back to the full string truncated at max length.
 */
function firstSentence(text: string, max = 150): string {
  const match = text.match(/^.+?[.!?](?:\s|$)/);
  const sentence = match ? match[0].trim() : text;
  return sentence.length > max ? sentence.slice(0, max - 1) + '…' : sentence;
}

/**
 * Extract the first 2-3 sentences from a string.
 */
function firstFewSentences(text: string, max = 450): string {
  const sentenceRe = /[^.!?]+[.!?]+/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentenceRe.exec(text)) !== null && sentences.length < 3) {
    sentences.push(match[0].trim());
  }
  const result = sentences.length > 0 ? sentences.join(' ') : text;
  return result.length > max ? result.slice(0, max - 1) + '…' : result;
}

/**
 * Normalize a validated raw strategy so all fields are always populated.
 * Synthesizes context_tagline and quick_version from legacy fields when absent.
 */
function normalizeStrategy(raw: StrategyFromSchema): Strategy {
  const sourceRef = raw.source_ref ?? raw.source?.formatted ?? '';
  const source = raw.source ?? { formatted: sourceRef };

  const context_tagline = raw.context_tagline ?? firstSentence(raw.why_fits);
  const quick_version = raw.quick_version ?? (raw.how_to ? firstFewSentences(raw.how_to) : '');

  return {
    title: raw.title,
    context_tagline,
    quick_version,
    steps: raw.steps,
    how_to: raw.how_to,
    why_fits: raw.why_fits,
    supporting_excerpt: raw.supporting_excerpt,
    source_ref: sourceRef,
    source,
  };
}

export function validateStrategies(parsed: unknown[]): Strategy[] {
  const valid: Strategy[] = [];

  for (const item of parsed) {
    const result = RawStrategySchema.safeParse(item);
    if (result.success) {
      valid.push(normalizeStrategy(result.data));
    }
  }

  return valid;
}
