import type { CitationLink } from '../types/cross-reference';

/**
 * Extracts citation markers like [1], [2], [3] from chat text
 * and maps them to strategy indices.
 *
 * Citations are 1-indexed in display ([1]) but map to 0-indexed strategy arrays.
 * Citations referencing indices beyond the strategy count are filtered out.
 */
export function extractCitations(
  chatText: string,
  strategyCount: number,
  messageId: string,
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
        strategyIndex: num - 1,
        messageId,
      });
    }
  }

  return citations;
}
