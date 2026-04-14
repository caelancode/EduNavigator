import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('EduNavigator')).toBeInTheDocument();
  });

  it('renders the landing screen with opening question', () => {
    render(<App />);
    expect(
      screen.getAllByText(/what are you working on/i).length,
    ).toBeGreaterThan(0);
  });

  it('renders support area cards on landing', () => {
    render(<App />);
    // Support area labels appear in both landing cards and left rail form,
    // so use getAllByText to account for multiple matches
    expect(screen.getAllByText(/Behavior Support/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Instruction & Learning/i).length,
    ).toBeGreaterThan(0);
  });
});
