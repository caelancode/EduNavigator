import { AppProvider } from './contexts/AppProvider';
import { AppShell } from './components/layout';
import { LeftRail } from './components/left-rail';
import { ChatPanel } from './components/chat';
import { WorkspacePanel } from './components/workspace';
import { ExportView } from './components/export';

function App() {
  return (
    <AppProvider>
      <AppShell
        leftPanel={<LeftRail />}
        centerPanel={<ChatPanel />}
        rightPanel={<WorkspacePanel />}
      />
      <ExportView />
    </AppProvider>
  );
}

export default App;
