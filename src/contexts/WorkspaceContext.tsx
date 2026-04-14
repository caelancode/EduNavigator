import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Strategy } from '../types/strategy';
import type { ApiErrorCode } from '../types/api';
import type { LeftRailState } from '../types/left-rail';

interface WorkspaceContextValue {
  strategies: Strategy[];
  contextAtGeneration: LeftRailState | null;
  pendingStrategies: { strategies: Strategy[]; context?: LeftRailState } | null;
  isLoading: boolean;
  error: { code: ApiErrorCode; message: string } | null;
  selectedIndices: Set<number>;
  setStrategies: (strategies: Strategy[], contextAtGeneration?: LeftRailState) => void;
  confirmPendingStrategies: () => void;
  cancelPendingStrategies: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: { code: ApiErrorCode; message: string } | null) => void;
  toggleSelection: (index: number) => void;
  clearSelection: () => void;
  selectAll: (count: number) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [contextAtGeneration, setContextAtGeneration] = useState<LeftRailState | null>(null);
  const [pendingStrategies, setPendingStrategies] = useState<{
    strategies: Strategy[];
    context?: LeftRailState;
  } | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<{
    code: ApiErrorCode;
    message: string;
  } | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

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

  const handleSetStrategies = useCallback(
    (newStrategies: Strategy[], ctx?: LeftRailState) => {
      if (selectedIndices.size > 0) {
        // Non-blocking: store as pending and let WorkspacePanel render a confirmation UI
        setPendingStrategies({ strategies: newStrategies, context: ctx });
        return;
      }
      setStrategies(newStrategies);
      if (ctx) setContextAtGeneration(ctx);
      setSelectedIndices(new Set());
      setError(null);
    },
    [selectedIndices],
  );

  const confirmPendingStrategies = useCallback(() => {
    if (!pendingStrategies) return;
    setStrategies(pendingStrategies.strategies);
    if (pendingStrategies.context) setContextAtGeneration(pendingStrategies.context);
    setSelectedIndices(new Set());
    setError(null);
    setPendingStrategies(null);
  }, [pendingStrategies]);

  const cancelPendingStrategies = useCallback(() => {
    setPendingStrategies(null);
  }, []);

  const value = useMemo(
    () => ({
      strategies,
      contextAtGeneration,
      pendingStrategies,
      isLoading,
      error,
      selectedIndices,
      setStrategies: handleSetStrategies,
      confirmPendingStrategies,
      cancelPendingStrategies,
      setLoading,
      setError,
      toggleSelection,
      clearSelection,
      selectAll,
    }),
    [
      strategies,
      contextAtGeneration,
      pendingStrategies,
      isLoading,
      error,
      selectedIndices,
      handleSetStrategies,
      confirmPendingStrategies,
      cancelPendingStrategies,
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
