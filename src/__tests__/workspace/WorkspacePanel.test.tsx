import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../contexts/AppProvider';
import { WorkspacePanel } from '../../components/workspace';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useEffect } from 'react';
import type { Strategy } from '../../types/strategy';

const testStrategies: Strategy[] = [
  {
    title: 'Strategy One',
    why_fits: 'Reason one',
    how_to: 'Steps one',
    supporting_excerpt: 'Excerpt one',
    source_ref: 'Source one',
  },
  {
    title: 'Strategy Two',
    why_fits: 'Reason two',
    how_to: 'Steps two',
    supporting_excerpt: 'Excerpt two',
    source_ref: 'Source two',
  },
];

function WorkspaceWithStrategies({
  strategies,
}: {
  strategies: Strategy[];
}) {
  const { setStrategies } = useWorkspace();
  useEffect(() => {
    setStrategies(strategies);
  }, [strategies, setStrategies]);
  return <WorkspacePanel />;
}

function WorkspaceWithLoading() {
  const { setLoading } = useWorkspace();
  useEffect(() => {
    setLoading(true);
  }, [setLoading]);
  return <WorkspacePanel />;
}

function WorkspaceWithError() {
  const { setError } = useWorkspace();
  useEffect(() => {
    setError({ code: 'network_error', message: 'Connection failed' });
  }, [setError]);
  return <WorkspacePanel />;
}

describe('WorkspacePanel', () => {
  it('shows empty state when no strategies', () => {
    render(
      <AppProvider>
        <WorkspacePanel />
      </AppProvider>,
    );
    expect(screen.getByText(/no strategies yet/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <AppProvider>
        <WorkspaceWithLoading />
      </AppProvider>,
    );
    expect(screen.getByText(/finding evidence-based/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <AppProvider>
        <WorkspaceWithError />
      </AppProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays strategy cards', () => {
    render(
      <AppProvider>
        <WorkspaceWithStrategies strategies={testStrategies} />
      </AppProvider>,
    );
    expect(screen.getByText('Strategy One')).toBeInTheDocument();
    expect(screen.getByText('Strategy Two')).toBeInTheDocument();
    expect(screen.getByText('Strategies (2)')).toBeInTheDocument();
  });

  it('shows selection count when strategies are selected', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <WorkspaceWithStrategies strategies={testStrategies} />
      </AppProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: /add strategy one to export/i }),
    );
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('toggles selection off when clicked again', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <WorkspaceWithStrategies strategies={testStrategies} />
      </AppProvider>,
    );

    const addButton = screen.getByRole('button', {
      name: /add strategy one to export/i,
    });
    await user.click(addButton);
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', {
      name: /remove strategy one from export/i,
    });
    await user.click(removeButton);
    expect(screen.queryByText(/\d+ selected/)).not.toBeInTheDocument();
  });
});
