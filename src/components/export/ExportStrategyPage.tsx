import type { Strategy } from '../../types/strategy';

interface ExportStrategyPageProps {
  strategy: Strategy;
  index: number;
}

export function ExportStrategyPage({
  strategy,
  index,
}: ExportStrategyPageProps) {
  return (
    <div className="export-strategy-page break-before-page pt-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold text-neutral-900">
          {strategy.title}
        </h3>
      </div>

      <div className="mb-4">
        <h4 className="mb-1 text-sm font-semibold text-neutral-700">
          Why This Fits
        </h4>
        <p className="text-sm leading-relaxed text-neutral-700">
          {strategy.why_fits}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="mb-1 text-sm font-semibold text-neutral-700">
          How to Implement
        </h4>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {strategy.how_to}
        </div>
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-3">
        <blockquote className="mb-2 border-l-2 border-neutral-300 pl-3 text-sm italic text-neutral-600">
          {strategy.supporting_excerpt}
        </blockquote>
        <cite className="text-xs not-italic text-neutral-500">
          {strategy.source_ref}
        </cite>
      </div>
    </div>
  );
}
