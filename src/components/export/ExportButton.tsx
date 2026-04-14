import { useState, useCallback } from 'react';
import { Button } from '../ui';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { ExportModal } from './ExportModal';

export function ExportButton() {
  const { strategies } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleOpen}
        aria-label="Export strategies to PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1.5 h-3.5 w-3.5"
          aria-hidden="true"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Export
      </Button>

      <ExportModal
        isOpen={isModalOpen}
        strategies={strategies}
        onClose={handleClose}
      />
    </>
  );
}
