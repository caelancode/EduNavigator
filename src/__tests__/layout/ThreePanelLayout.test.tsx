import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThreePanelLayout } from '../../components/layout';

describe('ThreePanelLayout', () => {
  it('renders all three panels', () => {
    render(
      <ThreePanelLayout
        leftPanel={<div>Left content</div>}
        centerPanel={<div>Center content</div>}
        rightPanel={<div>Right content</div>}
      />,
    );
    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Center content')).toBeInTheDocument();
    expect(screen.getByText('Right content')).toBeInTheDocument();
  });

  it('has correct ARIA landmarks', () => {
    render(
      <ThreePanelLayout
        leftPanel={<div>Left</div>}
        centerPanel={<div>Center</div>}
        rightPanel={<div>Right</div>}
      />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('log')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /evidence strategies/i })).toBeInTheDocument();
  });

  it('renders mobile tabs with tablist', () => {
    render(
      <ThreePanelLayout
        leftPanel={<div>Left</div>}
        centerPanel={<div>Center</div>}
        rightPanel={<div>Right</div>}
      />,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Strategies' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Chat' }),
    ).toHaveAttribute('aria-selected', 'true');
  });
});
