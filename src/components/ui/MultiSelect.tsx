interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  legend: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({
  legend,
  options,
  selectedValues,
  onChange,
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-700">{legend}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex min-h-[44px] items-start gap-2 cursor-pointer py-1.5 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              {opt.label}
              {opt.description && (
                <span className="block text-xs text-neutral-500">{opt.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
