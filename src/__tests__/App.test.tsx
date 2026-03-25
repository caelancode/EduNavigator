import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the EduNavigator heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /edunavigator/i }),
    ).toBeInTheDocument();
  });

  it('renders the main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders all three panels', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('log')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /evidence strategies/i }),
    ).toBeInTheDocument();
  });

  it('renders the skip-to-content link', () => {
    render(<App />);
    expect(
      screen.getByText('Skip to main content'),
    ).toBeInTheDocument();
  });

  it('renders Left Rail inputs', () => {
    render(<App />);
    expect(screen.getByLabelText('Grade/Age Band')).toBeInTheDocument();
    expect(screen.getByLabelText('Support Area')).toBeInTheDocument();
  });

  it('renders Chat input', () => {
    render(<App />);
    expect(
      screen.getByLabelText(/chat message input/i),
    ).toBeInTheDocument();
  });

  it('renders Workspace empty state', () => {
    render(<App />);
    expect(screen.getByText(/no strategies yet/i)).toBeInTheDocument();
  });
});
