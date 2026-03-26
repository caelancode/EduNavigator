import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../contexts/AppProvider';
import { LeftRail } from '../../components/left-rail';

function renderLeftRail() {
  return render(
    <AppProvider>
      <LeftRail />
    </AppProvider>,
  );
}

describe('LeftRail', () => {
  it('renders all core dropdowns', () => {
    renderLeftRail();
    expect(screen.getByLabelText('Grade/Age Band')).toBeInTheDocument();
    expect(screen.getByLabelText('Setting')).toBeInTheDocument();
    expect(screen.getByLabelText('Time Available')).toBeInTheDocument();
    expect(screen.getByLabelText('Support Area')).toBeInTheDocument();
  });

  it('renders grouping radio group', () => {
    renderLeftRail();
    expect(screen.getByText('Grouping')).toBeInTheDocument();
    expect(screen.getByLabelText('1:1')).toBeInTheDocument();
    expect(screen.getByLabelText('Small Group')).toBeInTheDocument();
  });

  it('renders collapsible sections', () => {
    renderLeftRail();
    expect(screen.getByText('Learner Characteristics')).toBeInTheDocument();
    expect(screen.getByText('Technology Context')).toBeInTheDocument();
    expect(screen.getByText('Output Preferences')).toBeInTheDocument();
    expect(screen.getByText('Role Perspective')).toBeInTheDocument();
  });

  it('shows learner portrait placeholder when nothing selected', () => {
    renderLeftRail();
    expect(
      screen.getByText(/select options below/i),
    ).toBeInTheDocument();
  });

  it('updates learner portrait when grade band is selected', async () => {
    const user = userEvent.setup();
    renderLeftRail();
    await user.selectOptions(screen.getByLabelText('Grade/Age Band'), '3_5');
    expect(screen.getByText('Current Context')).toBeInTheDocument();
    const portrait = screen.getByText('Current Context').closest('div');
    expect(portrait?.textContent).toContain('Grades 3–5');
  });

  it('shows sub-area dropdown when support area is selected', async () => {
    const user = userEvent.setup();
    renderLeftRail();

    expect(screen.queryByLabelText('Sub-Area')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Support Area'), 'communication_aac');
    expect(screen.getByLabelText('Sub-Area')).toBeInTheDocument();
  });

  it('disables Update Guidance button until minimum selections are made', async () => {
    const user = userEvent.setup();
    renderLeftRail();

    const button = screen.getByRole('button', {
      name: /select at least grade band/i,
    });
    expect(button).toBeDisabled();

    await user.selectOptions(screen.getByLabelText('Grade/Age Band'), 'prek_2');
    await user.selectOptions(screen.getByLabelText('Setting'), 'general_ed');
    await user.selectOptions(screen.getByLabelText('Support Area'), 'instructional_support');

    expect(
      screen.getByRole('button', { name: /update guidance/i }),
    ).toBeEnabled();
  });

  it('expands learner characteristics and shows multi-selects', async () => {
    const user = userEvent.setup();
    renderLeftRail();

    await user.click(screen.getByText('Learner Characteristics'));
    expect(screen.getByText('Communication Level')).toBeInTheDocument();
    expect(screen.getByText('Mobility Level')).toBeInTheDocument();
    expect(screen.getByText('Sensory Considerations')).toBeInTheDocument();
    expect(screen.getByText('Behavioral Considerations')).toBeInTheDocument();
  });
});
