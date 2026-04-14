import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Strategy, StrategyGroup } from '../types/strategy';
import type { ApiErrorCode } from '../types/api';
import type { LeftRailState } from '../types/left-rail';

interface WorkspaceContextValue {
  strategyGroups: StrategyGroup[];
  strategies: Strategy[];
  contextAtGeneration: LeftRailState | null;
  isLoading: boolean;
  error: { code: ApiErrorCode; message: string } | null;
  selectedIndices: Set<number>;
  setStrategies: (strategies: Strategy[], contextAtGeneration?: LeftRailState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: { code: ApiErrorCode; message: string } | null) => void;
  toggleSelection: (index: number) => void;
  clearSelection: () => void;
  selectAll: (count: number) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [strategyGroups, setStrategyGroups] = useState<StrategyGroup[]>([]);
  const [contextAtGeneration, setContextAtGeneration] = useState<LeftRailState | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<{
    code: ApiErrorCode;
    message: string;
  } | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Flat list derived from groups — all existing consumers remain unchanged
  const strategies = useMemo(
    () => strategyGroups.flatMap((g) => g.strategies),
    [strategyGroups],
  );

  const toggleSelection = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const selectAll = useCallback((count: number) => {
    setSelectedIndices(new Set(Array.from({ length: count }, (_, i) => i)));
  }, []);

  // Append-only: each call adds a new StrategyGroup rather than replacing existing ones.
  // This preserves strategies from earlier turns so educators can reference them throughout
  // the conversation.
  const handleSetStrategies = useCallback(
    (newStrategies: Strategy[], ctx?: LeftRailState) => {
      setStrategyGroups((prev) => [
        ...prev,
        {
          turnNumber: prev.length + 1,
          strategies: newStrategies,
          context: ctx,
        },
      ]);
      if (ctx) setContextAtGeneration(ctx);
      setError(null);
    },
    [],
  );

  const value = useMemo(
    () => ({
      strategyGroups,
      strategies,
      contextAtGeneration,
      isLoading,
      error,
      selectedIndices,
      setStrategies: handleSetStrategies,
      setLoading,
      setError,
      toggleSelection,
      clearSelection,
      selectAll,
    }),
    [
      strategyGroups,
      strategies,
      contextAtGeneration,
      isLoading,
      error,
      selectedIndices,
      handleSetStrategies,
      toggleSelection,
      clearSelection,
      selectAll,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
