import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from '../../components/ui';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Dropdown', () => {
  it('renders with label', () => {
    render(
      <Dropdown label="Test" options={options} value={null} onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Test')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(
      <Dropdown
        label="Test"
        options={options}
        value={null}
        onChange={() => {}}
        placeholder="Pick one"
      />,
    );
    const select = screen.getByLabelText('Test') as HTMLSelectElement;
    expect(select.value).toBe('');
  });

  it('calls onChange when option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Dropdown label="Test" options={options} value={null} onChange={handleChange} />,
    );
    await user.selectOptions(screen.getByLabelText('Test'), 'b');
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('renders all options', () => {
    render(
      <Dropdown label="Test" options={options} value={null} onChange={() => {}} />,
    );
    const selectElement = screen.getByLabelText('Test');
    expect(selectElement.querySelectorAll('option')).toHaveLength(4); // 3 + placeholder
  });
});
