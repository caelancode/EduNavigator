import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExportHeader } from '../../components/export';
import { initialLeftRailState } from '../../contexts/LeftRailContext';

describe('ExportHeader', () => {
  it('renders the report title', () => {
    render(
      <ExportHeader
        context={initialLeftRailState}
        generatedAt={Date.now()}
      />,
    );
    expect(
      screen.getByText('EduNavigator — Strategy Report'),
    ).toBeInTheDocument();
  });

  it('renders context labels when values are set', () => {
    const context = {
      ...initialLeftRailState,
      gradeBand: '3_5' as const,
      setting: 'general_ed' as const,
      supportArea: 'instructional_support',
    };
    render(<ExportHeader context={context} generatedAt={Date.now()} />);
    expect(screen.getByText('Grades 3–5')).toBeInTheDocument();
    expect(screen.getByText('General Education')).toBeInTheDocument();
    expect(screen.getByText('Instructional Support')).toBeInTheDocument();
  });

  it('omits rows with no value', () => {
    render(
      <ExportHeader
        context={initialLeftRailState}
        generatedAt={Date.now()}
      />,
    );
    expect(screen.queryByText('Grade/Age Band')).not.toBeInTheDocument();
  });

  it('renders generated date', () => {
    const date = new Date(2026, 2, 24, 10, 30).getTime();
    render(
      <ExportHeader context={initialLeftRailState} generatedAt={date} />,
    );
    expect(screen.getByText(/march/i)).toBeInTheDocument();
  });
});
