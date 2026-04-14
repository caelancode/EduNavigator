import { lazy, Suspense } from 'react';
import { AppProvider } from './contexts/AppProvider';
import { AppShell } from './components/layout';
import { LeftRail } from './components/left-rail';
import { ChatPanel } from './components/chat';
import { WorkspacePanel } from './components/workspace';

const ExportView = lazy(() =>
  import('./components/export').then((m) => ({ default: m.ExportView })),
);

function App() {
  return (
    <AppProvider>
      <AppShell
        leftPanel={<LeftRail />}
        centerPanel={<ChatPanel />}
        rightPanel={<WorkspacePanel />}
      />
      <Suspense fallback={null}>
        <ExportView />
      </Suspense>
    </AppProvider>
  );
}

export default App;
