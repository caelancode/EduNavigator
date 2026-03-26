interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  legend: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  name: string;
  variant?: 'default' | 'pills';
}

export function RadioGroup({
  legend,
  options,
  value,
  onChange,
  name,
  variant = 'default',
}: RadioGroupProps) {
  if (variant === 'pills') {
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-neutral-700">{legend}</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-1 ${
                  isSelected
                    ? 'border border-primary-700 bg-primary-700 text-white shadow-sm'
                    : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-neutral-700">{legend}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-neutral-700"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
