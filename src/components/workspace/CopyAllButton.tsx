import { useState, useCallback } from 'react';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function CopyAllButton() {
  const { strategies, selectedIndices } = useWorkspace();
  const [copied, setCopied] = useState(false);

  const handleCopyAll = useCallback(async () => {
    const items = selectedIndices.size > 0
      ? strategies.filter((_, i) => selectedIndices.has(i))
      : strategies;

    const text = items.map((s, i) => {
      const lines: string[] = [`Strategy ${i + 1}: ${s.title}`, ''];
      if (s.context_tagline) lines.push(`Context: ${s.context_tagline}`, '');
      lines.push('Quick Version:', s.quick_version, '');
      if (s.steps) {
        if (s.steps.prep.length > 0) {
          lines.push('Prep:');
          s.steps.prep.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
        if (s.steps.during.length > 0) {
          lines.push('During:');
          s.steps.during.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
        if (s.steps.follow_up.length > 0) {
          lines.push('Follow-Up:');
          s.steps.follow_up.forEach((step) => lines.push(`  • ${step}`));
          lines.push('');
        }
      } else if (s.how_to) {
        lines.push('How to Implement:', s.how_to, '');
      }
      lines.push('Why This Works:', s.why_fits, '', `"${s.supporting_excerpt}"`, `— ${s.source.formatted || s.source_ref}`);
      return lines.join('\n');
    }).join('\n\n---\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, [strategies, selectedIndices]);

  return (
    <button
      type="button"
      onClick={handleCopyAll}
      className={`flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${copied ? 'border-success-500 bg-success-50 text-success-800' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 animate-scale-in motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          Copy All Strategies
        </>
      )}
    </button>
  );
}
