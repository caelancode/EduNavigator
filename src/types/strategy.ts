export interface Strategy {
  title: string;
  why_fits: string;
  how_to: string;
  supporting_excerpt: string;
  source_ref: string;
}

export interface StrategyCardProps {
  strategy: Strategy;
  index: number;
  isSelected: boolean;
  onToggleSelect: (index: number) => void;
}
