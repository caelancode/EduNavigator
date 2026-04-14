import type { ReactNode } from 'react';
import { LeftRailProvider } from './LeftRailContext';
import { ChatProvider } from './ChatContext';
import { WorkspaceProvider } from './WorkspaceContext';
import { CrossReferenceProvider } from './CrossReferenceContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <CrossReferenceProvider>
      <LeftRailProvider>
        <ChatProvider>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </ChatProvider>
      </LeftRailProvider>
    </CrossReferenceProvider>
  );
}
