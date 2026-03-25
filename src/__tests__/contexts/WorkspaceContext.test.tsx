import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  WorkspaceProvider,
  useWorkspace,
} from '../../contexts/WorkspaceContext';
import type { Strategy } from '../../types/strategy';

const testStrategy: Strategy = {
  title: 'Test',
  why_fits: 'Why',
  how_to: 'How',
  supporting_excerpt: 'Excerpt',
  source_ref: 'Source',
};

function TestConsumer() {
  const {
    strategies,
    selectedIndices,
    toggleSelection,
    clearSelection,
    setStrategies,
  } = useWorkspace();

  return (
    <div>
      <span data-testid="count">{strategies.length}</span>
      <span data-testid="selected">{selectedIndices.size}</span>
      <button onClick={() => setStrategies([testStrategy, testStrategy])}>
        Load
      </button>
      <button onClick={() => toggleSelection(0)}>Toggle 0</button>
      <button onClick={() => toggleSelection(1)}>Toggle 1</button>
      <button onClick={() => clearSelection()}>Clear</button>
      <button onClick={() => setStrategies([testStrategy])}>Reload</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <WorkspaceProvider>
      <TestConsumer />
    </WorkspaceProvider>,
  );
}

describe('WorkspaceContext', () => {
  it('starts with empty strategies', () => {
    renderConsumer();
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('selected').textContent).toBe('0');
  });

  it('sets strategies', async () => {
    renderConsumer();
    await act(async () => {
      screen.getByText('Load').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('toggles selection', async () => {
    renderConsumer();
    await act(async () => {
      screen.getByText('Load').click();
    });
    await act(async () => {
      screen.getByText('Toggle 0').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('1');

    await act(async () => {
      screen.getByText('Toggle 0').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('0');
  });

  it('supports multiple selections', async () => {
    renderConsumer();
    await act(async () => {
      screen.getByText('Load').click();
    });
    await act(async () => {
      screen.getByText('Toggle 0').click();
    });
    await act(async () => {
      screen.getByText('Toggle 1').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('2');
  });

  it('clears selection', async () => {
    renderConsumer();
    await act(async () => {
      screen.getByText('Load').click();
    });
    await act(async () => {
      screen.getByText('Toggle 0').click();
    });
    await act(async () => {
      screen.getByText('Clear').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('0');
  });

  it('clears selection when strategies are replaced', async () => {
    renderConsumer();
    await act(async () => {
      screen.getByText('Load').click();
    });
    await act(async () => {
      screen.getByText('Toggle 0').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('1');

    await act(async () => {
      screen.getByText('Reload').click();
    });
    expect(screen.getByTestId('selected').textContent).toBe('0');
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
