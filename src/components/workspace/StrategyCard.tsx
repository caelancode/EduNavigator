import type { StrategyCardProps } from '../../types/strategy';
import { Card } from '../ui';
import { StrategyTitle } from './StrategyTitle';
import { WhyFits } from './WhyFits';
import { HowTo } from './HowTo';
import { SourceReference } from './SourceReference';

export function StrategyCard({
  strategy,
  index,
  isSelected,
  onToggleSelect,
}: StrategyCardProps) {
  return (
    <Card
      className={`transition-shadow ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <article data-selected={isSelected || undefined}>
        <div className="mb-3 flex items-start justify-between">
          <StrategyTitle title={strategy.title} index={index} />
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(index)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              aria-label={`Select ${strategy.title} for export`}
            />
            <span className="text-xs text-neutral-500">Export</span>
          </label>
        </div>

        <div className="space-y-3">
          <WhyFits text={strategy.why_fits} />
          <HowTo text={strategy.how_to} />
          <SourceReference
            excerpt={strategy.supporting_excerpt}
            reference={strategy.source_ref}
          />
        </div>
      </article>
    </Card>
  );
}
