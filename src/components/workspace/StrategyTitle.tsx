interface StrategyTitleProps {
  title: string;
  index: number;
}

export function StrategyTitle({ title, index }: StrategyTitleProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
        {index + 1}
      </span>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
    </div>
  );
}
