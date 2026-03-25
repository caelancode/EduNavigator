import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Strategy } from '../types/strategy';
import type { ApiErrorCode } from '../types/api';

interface WorkspaceContextValue {
  strategies: Strategy[];
  isLoading: boolean;
  error: { code: ApiErrorCode; message: string } | null;
  selectedIndices: Set<number>;
  setStrategies: (strategies: Strategy[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: { code: ApiErrorCode; message: string } | null) => void;
  toggleSelection: (index: number) => void;
  clearSelection: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<{
    code: ApiErrorCode;
    message: string;
  } | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
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

  const handleSetStrategies = useCallback((newStrategies: Strategy[]) => {
    setStrategies(newStrategies);
    setSelectedIndices(new Set());
    setError(null);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        strategies,
        isLoading,
        error,
        selectedIndices,
        setStrategies: handleSetStrategies,
        setLoading,
        setError,
        toggleSelection,
        clearSelection,
      }}
    >
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
