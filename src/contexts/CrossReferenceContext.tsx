import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {
  ConversationPhase,
  CitationLink,
} from '../types/cross-reference';

type CitationInteraction = 'hover' | 'click';

interface CrossReferenceContextValue {
  /** Currently active (hovered/clicked) citation, or null */
  activeCitation: CitationLink | null;
  /** Whether the active citation was triggered by hover or click */
  activeCitationInteraction: CitationInteraction | null;
  /** All citation links from the most recent strategy-bearing response */
  citations: CitationLink[];
  /** Current conversation phase */
  phase: ConversationPhase;
  /** Increments each time strategies are updated; used to detect stale citations */
  strategyGeneration: number;
  /** Set the active citation (triggers scroll-to-highlight in workspace) */
  setActiveCitation: (citation: CitationLink | null, interaction?: CitationInteraction) => void;
  /** Replace all citations (called when a new response with strategies arrives) */
  setCitations: (citations: CitationLink[]) => void;
  /** Update conversation phase */
  setPhase: (phase: ConversationPhase) => void;
  /** Increment the strategy generation counter */
  incrementGeneration: () => void;
  /** Mutable ref map: strategy index -> DOM element, for scroll targeting */
  strategyCardRefs: React.MutableRefObject<Map<number, HTMLElement>>;
}

const CrossReferenceContext =
  createContext<CrossReferenceContextValue | null>(null);

export function CrossReferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeCitation, setActiveCitationRaw] = useState<CitationLink | null>(
    null,
  );
  const [activeCitationInteraction, setActiveCitationInteraction] = useState<CitationInteraction | null>(null);
  const [citations, setCitations] = useState<CitationLink[]>([]);
  const [phase, setPhase] = useState<ConversationPhase>('idle');
  const [strategyGeneration, setStrategyGeneration] = useState(0);
  const strategyCardRefs = useRef<Map<number, HTMLElement>>(new Map());

  const setActiveCitation = useCallback(
    (citation: CitationLink | null, interaction: CitationInteraction = 'hover') => {
      setActiveCitationRaw(citation);
      setActiveCitationInteraction(interaction);
    },
    [],
  );

  const incrementGeneration = useCallback(() => {
    setStrategyGeneration((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      activeCitation,
      activeCitationInteraction,
      citations,
      phase,
      strategyGeneration,
      setActiveCitation,
      setCitations,
      setPhase,
      incrementGeneration,
      strategyCardRefs,
    }),
    [activeCitation, activeCitationInteraction, citations, phase, strategyGeneration, setActiveCitation, setCitations, setPhase, incrementGeneration, strategyCardRefs],
  );

  return (
    <CrossReferenceContext.Provider value={value}>
      {children}
    </CrossReferenceContext.Provider>
  );
}

export function useCrossReference(): CrossReferenceContextValue {
  const context = useContext(CrossReferenceContext);
  if (!context) {
    throw new Error(
      'useCrossReference must be used within a CrossReferenceProvider',
    );
  }
  return context;
}
