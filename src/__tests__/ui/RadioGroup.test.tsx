import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from '../../components/ui';

const options = [
  { value: 'x', label: 'Choice X' },
  { value: 'y', label: 'Choice Y' },
];

describe('RadioGroup', () => {
  it('renders legend and options', () => {
    render(
      <RadioGroup
        legend="Pick one"
        name="test"
        options={options}
        value={null}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Pick one')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice X')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice Y')).toBeInTheDocument();
  });

  it('checks the selected value', () => {
    render(
      <RadioGroup
        legend="Pick one"
        name="test"
        options={options}
        value="y"
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Choice Y')).toBeChecked();
    expect(screen.getByLabelText('Choice X')).not.toBeChecked();
  });

  it('calls onChange when option clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup
        legend="Pick one"
        name="test"
        options={options}
        value={null}
        onChange={handleChange}
      />,
    );
    await user.click(screen.getByLabelText('Choice X'));
    expect(handleChange).toHaveBeenCalledWith('x');
  });
});
