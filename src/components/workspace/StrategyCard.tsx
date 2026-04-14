import { memo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { StrategyCardProps } from '../../types/strategy';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { BADGE_COLORS, BADGE_HEX } from '../../constants/badge-colors';
import { CollapsibleSection } from '../ui/CollapsibleSection';

export const StrategyCard = memo(function StrategyCard({
  strategy,
  index,
  isExpanded,
  onToggleExpand,
}: StrategyCardProps) {
  const { activeCitation, strategyCardRefs } = useCrossReference();
  const cardRef = useRef<HTMLElement>(null);
  const isHighlighted = activeCitation?.strategyIndex === index;

  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      strategyCardRefs.current.set(index, el);
    }
    return () => {
      strategyCardRefs.current.delete(index);
    };
  }, [index, strategyCardRefs]);

  // Short-form citation for the Source collapsible title badge
  const shortCitation = (() => {
    const { authors, year } = strategy.source;
    if (authors && year) {
      const firstAuthor = authors.split(',')[0].trim();
      const lastName = firstAuthor.split(' ').pop() ?? firstAuthor;
      const hasMultiple = authors.includes(',');
      return `${lastName}${hasMultiple ? ' et al.' : ''}, ${year}`;
    }
    return strategy.source.formatted.slice(0, 40);
  })();

  return (
    <article
      ref={cardRef}
      data-stripe-visible={isHighlighted || isExpanded || undefined}
      style={{ '--stripe-color': BADGE_HEX[index % BADGE_HEX.length] } as React.CSSProperties}
      className={`accent-stripe flex flex-col overflow-hidden rounded-2xl border border-neutral-200/50 pl-8 pr-6 shadow-card transition-all duration-200 animate-fade-in-up motion-reduce:animate-none hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 stagger-${Math.min(index + 1, 5)} ${isHighlighted || isExpanded ? 'bg-primary-50 ring-1 ring-primary-300 shadow-card-hover' : 'bg-white'}`}
    >
      {/* ── Tier 1: Always visible ────────────────────────────────────────── */}
      <div className="flex items-start">
        <button
          type="button"
          onClick={() => onToggleExpand(index)}
          aria-expanded={isExpanded}
          className="flex flex-1 flex-col gap-3 py-5 text-left focus:outline-none"
        >
          {/* Header row: numbered badge + title */}
          <div className="flex w-full items-start gap-4">
            <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${BADGE_COLORS[index % BADGE_COLORS.length]}`}>
              {index + 1}
            </div>
            <h3 className="flex-1 min-w-0 font-heading text-xl font-bold leading-tight text-neutral-900">
              {strategy.title}
            </h3>
          </div>

          {/* Context tagline — full card width */}
          <p className="text-sm leading-relaxed text-neutral-500 italic">
            {strategy.context_tagline}
          </p>

          {/* Quick Version — full card width */}
          <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">Quick Version</p>
            <p className="text-sm leading-relaxed text-neutral-700">
              {strategy.quick_version}
            </p>
          </div>
        </button>

      </div>

      {/* ── Tier 2 & 3: Expandable content ───────────────────────────────── */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pb-6">
            {/* ── Tier 2: Step-by-step ──────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Step-by-Step
              </h4>

              {strategy.steps ? (
                <div className="flex flex-col gap-4">
                  {strategy.steps.prep.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700" aria-hidden="true">1</span>
                        <h5 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Prep</h5>
                      </div>
                      <ul className="flex flex-col gap-1.5 pl-2">
                        {strategy.steps.prep.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                            <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-0">{step}</ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {strategy.steps.during.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700" aria-hidden="true">2</span>
                        <h5 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">During</h5>
                      </div>
                      <ul className="flex flex-col gap-1.5 pl-2">
                        {strategy.steps.during.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                            <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-0">{step}</ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {strategy.steps.follow_up.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700" aria-hidden="true">3</span>
                        <h5 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Follow-Up</h5>
                      </div>
                      <ul className="flex flex-col gap-1.5 pl-2">
                        {strategy.steps.follow_up.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                            <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-0">{step}</ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : strategy.how_to ? (
                // Legacy fallback: flat markdown block
                <div className="prose prose-sm max-w-none leading-relaxed text-neutral-700 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5">
                  <ReactMarkdown>{strategy.how_to}</ReactMarkdown>
                </div>
              ) : null}
            </div>

            {/* ── Tier 3: Why This Works + Source (collapsed by default) ── */}
            <div className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 px-4">
              <CollapsibleSection title="Why This Works" defaultOpen={false}>
                <div className="prose prose-sm max-w-none leading-relaxed text-neutral-600 prose-p:my-1.5">
                  <ReactMarkdown>{strategy.why_fits}</ReactMarkdown>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Source"
                defaultOpen={false}
                badge={shortCitation}
              >
                <div className="flex flex-col gap-3">
                  <blockquote className="rounded-r-lg border-l-4 border-primary-300 bg-white p-3 italic leading-relaxed text-neutral-600 shadow-sm text-sm">
                    &ldquo;{strategy.supporting_excerpt}&rdquo;
                  </blockquote>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs leading-normal text-neutral-600">{strategy.source.formatted || strategy.source_ref}</p>
                    <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700" title="This citation was generated by AI and should be verified before citing in professional documents">
                      AI-generated
                    </span>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom expand tab ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => onToggleExpand(index)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? `Collapse ${strategy.title}` : `Expand ${strategy.title}`}
        className="flex w-full items-center justify-center border-t border-neutral-100 py-2 text-neutral-300 transition-colors hover:text-neutral-500 focus:outline-none rounded-b-2xl motion-reduce:transition-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </article>
  );
});
