import type { CitationLink } from '../types/cross-reference';

/**
 * Extracts citation markers like [1], [2], [3] from chat text
 * and maps them to strategy indices.
 *
 * Citations are 1-indexed in display ([1]) but map to 0-indexed strategy arrays.
 * Citations referencing indices beyond the strategy count are filtered out.
 *
 * @param offset - Number of strategies that existed before this batch. Used to
 *   translate per-turn citation numbers (e.g. [1] in turn 2) into global
 *   workspace indices (e.g. index 3 when 3 strategies already exist).
 */
export function extractCitations(
  chatText: string,
  strategyCount: number,
  messageId: string,
  offset = 0,
): CitationLink[] {
  if (strategyCount === 0) return [];

  const pattern = /\[(\d+)\]/g;
  const seen = new Set<number>();
  const citations: CitationLink[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(chatText)) !== null) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= strategyCount && !seen.has(num)) {
      seen.add(num);
      citations.push({
        citationNumber: num,
        strategyIndex: num - 1 + offset,
        messageId,
      });
    }
  }

  return citations;
}
