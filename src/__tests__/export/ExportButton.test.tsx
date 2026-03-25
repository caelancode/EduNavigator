import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../contexts/AppProvider';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { ExportButton } from '../../components/export';
import { useEffect } from 'react';
import type { Strategy } from '../../types/strategy';

const testStrategy: Strategy = {
  title: 'Test',
  why_fits: 'Why',
  how_to: 'How',
  supporting_excerpt: 'Excerpt',
  source_ref: 'Source',
};

function ExportButtonWithSelection() {
  const { setStrategies, toggleSelection } = useWorkspace();
  useEffect(() => {
    setStrategies([testStrategy]);
    toggleSelection(0);
  }, [setStrategies, toggleSelection]);
  return <ExportButton />;
}

describe('ExportButton', () => {
  it('is disabled when nothing is selected', () => {
    render(
      <AppProvider>
        <ExportButton />
      </AppProvider>,
    );
    expect(
      screen.getByRole('button', { name: /select strategies to export/i }),
    ).toBeDisabled();
  });

  it('is enabled when strategies are selected', () => {
    render(
      <AppProvider>
        <ExportButtonWithSelection />
      </AppProvider>,
    );
    expect(
      screen.getByRole('button', { name: /export 1 selected/i }),
    ).toBeEnabled();
  });
});
