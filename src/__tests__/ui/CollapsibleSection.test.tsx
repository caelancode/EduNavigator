import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { CollapsibleSection } from '../../components/ui';

describe('CollapsibleSection', () => {
  it('renders title', () => {
    render(
      <CollapsibleSection title="My Section">
        <p>Content</p>
      </CollapsibleSection>,
    );
    expect(screen.getByText('My Section')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    render(
      <CollapsibleSection title="My Section">
        <p>Hidden content</p>
      </CollapsibleSection>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('shows content when defaultOpen is true', () => {
    render(
      <CollapsibleSection title="My Section" defaultOpen>
        <p>Visible content</p>
      </CollapsibleSection>,
    );
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('toggles content on click', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="My Section">
        <p>Toggle me</p>
      </CollapsibleSection>,
    );

    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument();

    await user.click(screen.getByText('My Section'));
    expect(screen.getByText('Toggle me')).toBeInTheDocument();

    await user.click(screen.getByText('My Section'));
    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument();
  });

  it('has correct aria-expanded attribute', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="My Section">
        <p>Content</p>
      </CollapsibleSection>,
    );

    const button = screen.getByRole('button', { name: 'My Section' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
