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
    <div className="mb-10 break-inside-avoid border-b border-neutral-200 pb-10 font-[system-ui] last:mb-0 last:border-0 last:pb-0">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-700 text-sm font-bold text-primary-700">
          {index + 1}
        </div>
        <h3 className="text-lg font-bold text-neutral-800">
          {strategy.title}
        </h3>
      </div>

      <div className="mb-5 pl-12">
        <h4 className="mb-1.5 text-sm font-semibold text-primary-700">
          Why This Fits
        </h4>
        <p className="text-sm leading-relaxed text-neutral-700">
          {strategy.why_fits}
        </p>
      </div>

      <div className="mb-5 pl-12">
        <h4 className="mb-1.5 text-sm font-semibold text-neutral-800">
          How to Implement
        </h4>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {strategy.how_to}
        </p>
      </div>

      <div className="pl-12">
        <div className="mb-3 rounded-r-md border-l-[3px] border-primary-300 bg-neutral-50 p-4">
          <blockquote className="text-sm italic leading-relaxed text-neutral-600">
            &ldquo;{strategy.supporting_excerpt}&rdquo;
          </blockquote>
        </div>
        <p className="text-xs leading-normal text-neutral-600">
          {strategy.source_ref}
        </p>
      </div>
    </div>
  );
}
