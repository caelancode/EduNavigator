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
      {/* Header: number + title + tagline */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-700 text-sm font-bold text-primary-700">
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-800">
            {strategy.title}
          </h3>
          {strategy.context_tagline && (
            <p className="mt-0.5 text-sm italic text-neutral-500">
              {strategy.context_tagline}
            </p>
          )}
        </div>
      </div>

      {/* Quick Version */}
      <div className="mb-5 ml-12 rounded-md border-l-4 border-primary-400 bg-primary-50 px-4 py-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
          Quick Version
        </p>
        <p className="text-sm leading-relaxed text-neutral-700">
          {strategy.quick_version}
        </p>
      </div>

      {/* Step-by-step (new format) or How to Implement (legacy) */}
      <div className="mb-5 pl-12">
        {strategy.steps ? (
          <>
            <h4 className="mb-3 text-sm font-semibold text-neutral-800">
              Step-by-Step
            </h4>
            <div className="flex flex-col gap-4">
              {strategy.steps.prep.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Prep</p>
                  </div>
                  <ul className="flex flex-col gap-1 pl-2">
                    {strategy.steps.prep.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {strategy.steps.during.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">During</p>
                  </div>
                  <ul className="flex flex-col gap-1 pl-2">
                    {strategy.steps.during.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {strategy.steps.follow_up.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Follow-Up</p>
                  </div>
                  <ul className="flex flex-col gap-1 pl-2">
                    {strategy.steps.follow_up.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : strategy.how_to ? (
          <>
            <h4 className="mb-1.5 text-sm font-semibold text-neutral-800">
              How to Implement
            </h4>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
              {strategy.how_to}
            </p>
          </>
        ) : null}
      </div>

      {/* Why This Fits — after steps, rationale is secondary */}
      <div className="mb-5 pl-12">
        <h4 className="mb-1.5 text-sm font-semibold text-primary-700">
          Why This Fits
        </h4>
        <p className="text-sm leading-relaxed text-neutral-700">
          {strategy.why_fits}
        </p>
      </div>

      {/* Supporting excerpt + source */}
      <div className="pl-12">
        <div className="mb-3 rounded-r-md border-l-[3px] border-primary-300 bg-neutral-50 p-4">
          <blockquote className="text-sm italic leading-relaxed text-neutral-600">
            &ldquo;{strategy.supporting_excerpt}&rdquo;
          </blockquote>
        </div>
        <p className="text-xs leading-normal text-neutral-600">
          {strategy.source.formatted || strategy.source_ref}
        </p>
      </div>
    </div>
  );
}
