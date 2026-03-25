import type { ReactNode } from 'react';
import { LeftRailProvider } from './LeftRailContext';
import { ChatProvider } from './ChatContext';
import { WorkspaceProvider } from './WorkspaceContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <LeftRailProvider>
      <ChatProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </ChatProvider>
    </LeftRailProvider>
  );
}
