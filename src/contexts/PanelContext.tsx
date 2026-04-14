import { createContext, useContext } from 'react';

export interface PanelContextValue {
  isLeftRailOpen: boolean;
  isWorkspaceOpen: boolean;
  toggleLeftRail: () => void;
  toggleWorkspace: () => void;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

export function usePanelContext(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('usePanelContext must be used within ThreePanelLayout');
  return ctx;
}
