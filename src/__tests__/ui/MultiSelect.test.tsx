import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect } from '../../components/ui';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('MultiSelect', () => {
  it('renders legend and all options', () => {
    render(
      <MultiSelect
        legend="Choose"
        options={options}
        selectedValues={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Choose')).toBeInTheDocument();
    expect(screen.getByLabelText('Alpha')).toBeInTheDocument();
    expect(screen.getByLabelText('Beta')).toBeInTheDocument();
    expect(screen.getByLabelText('Gamma')).toBeInTheDocument();
  });

  it('checks selected values', () => {
    render(
      <MultiSelect
        legend="Choose"
        options={options}
        selectedValues={['a', 'c']}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Alpha')).toBeChecked();
    expect(screen.getByLabelText('Beta')).not.toBeChecked();
    expect(screen.getByLabelText('Gamma')).toBeChecked();
  });

  it('adds value when unchecked option is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        legend="Choose"
        options={options}
        selectedValues={['a']}
        onChange={handleChange}
      />,
    );
    await user.click(screen.getByLabelText('Beta'));
    expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('removes value when checked option is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        legend="Choose"
        options={options}
        selectedValues={['a', 'b']}
        onChange={handleChange}
      />,
    );
    await user.click(screen.getByLabelText('Alpha'));
    expect(handleChange).toHaveBeenCalledWith(['b']);
  });
});
