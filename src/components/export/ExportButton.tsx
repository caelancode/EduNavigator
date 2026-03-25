import { useCallback } from 'react';
import { Button } from '../ui';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function ExportButton() {
  const { selectedIndices } = useWorkspace();
  const hasSelection = selectedIndices.size > 0;

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={!hasSelection}
      onClick={handleExport}
      aria-label={
        hasSelection
          ? `Export ${selectedIndices.size} selected strategies`
          : 'Select strategies to export'
      }
    >
      Export
    </Button>
  );
}
