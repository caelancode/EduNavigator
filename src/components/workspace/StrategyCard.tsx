import { useState, useCallback } from 'react';
import type { StrategyCardProps } from '../../types/strategy';

export function StrategyCard({
  strategy,
  index,
  isSelected,
  onToggleSelect,
}: StrategyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = [
      strategy.title,
      '',
      'Why This Fits:',
      strategy.why_fits,
      '',
      'How to Implement:',
      strategy.how_to,
      '',
      `"${strategy.supporting_excerpt}"`,
      `— ${strategy.source_ref}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, [strategy]);

  return (
    <article
      data-selected={isSelected || undefined}
      className="flex flex-col gap-6 rounded-2xl bg-surface-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 font-bold text-white shadow-sm">
            {index + 1}
          </div>
          <h3 className="text-xl font-bold leading-tight text-neutral-800">
            {strategy.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onToggleSelect(index)}
          aria-label={isSelected ? `Remove ${strategy.title} from export` : `Add ${strategy.title} to export`}
          aria-pressed={isSelected}
          title={isSelected ? 'Remove from export' : 'Select for export'}
          className="-mr-2 -mt-2 shrink-0 rounded-full p-2 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSelected ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-6 w-6 transition-colors ${isSelected ? 'text-primary-600' : 'text-neutral-400 hover:text-primary-600'}`}
            aria-hidden="true"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-primary-100/50 bg-callout-fit p-4 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-primary-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-primary-600"
            aria-hidden="true"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
          </svg>
          <h4 className="text-xs uppercase tracking-wide">Why This Fits</h4>
        </div>
        <p className="leading-relaxed text-neutral-600">{strategy.why_fits}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-accent-100/50 bg-callout-implement p-4 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-accent-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-accent-700"
            aria-hidden="true"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <h4 className="text-xs uppercase tracking-wide">How to Implement</h4>
        </div>
        <p className="leading-relaxed text-neutral-600">{strategy.how_to}</p>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <blockquote className="rounded-r-lg border-l-4 border-primary-300 bg-surface-100 p-4 italic leading-relaxed text-neutral-600 shadow-sm">
          &ldquo;{strategy.supporting_excerpt}&rdquo;
        </blockquote>
        <div className="flex items-start justify-between gap-2 pl-4">
          <p className="text-sm text-neutral-600">{strategy.source_ref}</p>
          <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-500" title="This citation is AI-generated and should be verified independently">
            AI-generated
          </span>
        </div>
      </div>

      <div className="flex justify-end border-t border-neutral-100 pt-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={copied ? 'Copied to clipboard' : `Copy ${strategy.title} strategy`}
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              Copy
            </>
          )}
        </button>
      </div>
    </article>
  );
}
