import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../contexts/AppProvider';
import { ThreePanelLayout } from '../../components/layout';

function renderLayout() {
  return render(
    <AppProvider>
      <ThreePanelLayout
        leftPanel={<div>Left content</div>}
        centerPanel={<div>Center content</div>}
        rightPanel={<div>Right content</div>}
      />
    </AppProvider>,
  );
}

describe('ThreePanelLayout', () => {
  it('renders all three panels', () => {
    renderLayout();
    expect(screen.getAllByText('Left content').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Center content').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Right content').length).toBeGreaterThanOrEqual(1);
  });

  it('has correct ARIA landmarks', () => {
    renderLayout();
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('log').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole('region', { name: /evidence strategies/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders mobile settings FAB', () => {
    renderLayout();
    expect(
      screen.getByRole('button', { name: /open settings/i }),
    ).toBeInTheDocument();
  });

  it('renders bottom sheet dialogs', () => {
    renderLayout();
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs.length).toBe(2);
  });
});
