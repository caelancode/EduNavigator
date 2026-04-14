export interface SourceReference {
  /** Full formatted citation string */
  formatted: string;
  /** Author(s) */
  authors?: string;
  /** Publication year */
  year?: string;
  /** Title of the work */
  title?: string;
  /** Journal or publication name */
  publication?: string;
  /** Specific page range, chapter, or location within the work */
  location?: string;
}

export interface Steps {
  prep: string[];
  during: string[];
  follow_up: string[];
}

export interface Strategy {
  title: string;
  /** One-sentence context hook connecting strategy to user's situation */
  context_tagline: string;
  /** 2-3 sentence core action — actionable without reading full steps */
  quick_version: string;
  /** Phased implementation steps (new format) */
  steps?: Steps;
  /** Flat implementation instructions (legacy format, optional) */
  how_to?: string;
  why_fits: string;
  supporting_excerpt: string;
  /** Structured source reference with optional breakdown fields */
  source: SourceReference;
  /** Formatted citation string (backward compatible) */
  source_ref: string;
}

export interface StrategyCardProps {
  strategy: Strategy;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (index: number) => void;
}

export interface StrategyGroup {
  /** 1-indexed turn number, shown in the workspace divider */
  turnNumber: number;
  strategies: Strategy[];
  context?: import('./left-rail').LeftRailState;
}
