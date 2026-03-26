import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StrategyCard } from '../../components/workspace';
import type { Strategy } from '../../types/strategy';

const testStrategy: Strategy = {
  title: 'Visual Schedule Supports',
  why_fits: 'Provides predictable structure for students.',
  how_to: '1. Create a visual schedule.\n2. Review with the student.',
  supporting_excerpt: 'Visual supports increase on-task behavior.',
  source_ref: 'Browder et al. (2014). Evidence-based practices.',
};

describe('StrategyCard', () => {
  it('renders all strategy fields', () => {
    render(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={false}
        onToggleSelect={() => {}}
      />,
    );

    expect(screen.getByText('Visual Schedule Supports')).toBeInTheDocument();
    expect(
      screen.getByText('Provides predictable structure for students.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Create a visual schedule/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Visual supports increase on-task behavior/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Browder et al. (2014). Evidence-based practices.'),
    ).toBeInTheDocument();
  });

  it('renders index badge', () => {
    render(
      <StrategyCard
        strategy={testStrategy}
        index={2}
        isSelected={false}
        onToggleSelect={() => {}}
      />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('has article element', () => {
    render(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={false}
        onToggleSelect={() => {}}
      />,
    );
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('reflects selection state via data-selected', () => {
    const { rerender } = render(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={false}
        onToggleSelect={() => {}}
      />,
    );
    expect(screen.getByRole('article')).not.toHaveAttribute('data-selected');

    rerender(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={true}
        onToggleSelect={() => {}}
      />,
    );
    expect(screen.getByRole('article')).toHaveAttribute('data-selected', 'true');
  });

  it('calls onToggleSelect when bookmark button is clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <StrategyCard
        strategy={testStrategy}
        index={1}
        isSelected={false}
        onToggleSelect={handleToggle}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /add visual schedule supports to export/i }),
    );
    expect(handleToggle).toHaveBeenCalledWith(1);
  });

  it('bookmark button label changes when selected', () => {
    const { rerender } = render(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={false}
        onToggleSelect={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: /add visual schedule supports to export/i }),
    ).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={true}
        onToggleSelect={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: /remove visual schedule supports from export/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('bookmark button is keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <StrategyCard
        strategy={testStrategy}
        index={0}
        isSelected={false}
        onToggleSelect={handleToggle}
      />,
    );

    const button = screen.getByRole('button', {
      name: /add visual schedule supports to export/i,
    });
    button.focus();
    await user.keyboard('{Enter}');
    expect(handleToggle).toHaveBeenCalledWith(0);
  });
});
