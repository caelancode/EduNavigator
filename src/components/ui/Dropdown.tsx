interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  id,
}: DropdownProps) {
  const selectId = id ?? `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-neutral-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="block h-12 w-full cursor-pointer appearance-none rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-700 shadow-sm transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
