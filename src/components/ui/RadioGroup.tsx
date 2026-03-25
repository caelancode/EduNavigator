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
}

export function RadioGroup({
  legend,
  options,
  value,
  onChange,
  name,
}: RadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-700">{legend}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700"
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
