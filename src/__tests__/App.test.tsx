import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the EduNavigator heading', () => {
    render(<App />);
    const headings = screen.getAllByRole('heading', { name: /edunavigator/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders all three panels', () => {
    render(<App />);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('log').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole('region', { name: /evidence strategies/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders the skip-to-content link', () => {
    render(<App />);
    expect(
      screen.getByText('Skip to main content'),
    ).toBeInTheDocument();
  });

  it('renders Left Rail inputs', () => {
    render(<App />);
    const gradeBands = screen.getAllByLabelText('Grade/Age Band');
    expect(gradeBands.length).toBeGreaterThanOrEqual(1);
    const supportAreas = screen.getAllByLabelText('Support Area');
    expect(supportAreas.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Chat input', () => {
    render(<App />);
    const inputs = screen.getAllByLabelText(/chat message input/i);
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Workspace empty state', () => {
    render(<App />);
    const emptyTexts = screen.getAllByText(/no strategies yet/i);
    expect(emptyTexts.length).toBeGreaterThanOrEqual(1);
  });
});
