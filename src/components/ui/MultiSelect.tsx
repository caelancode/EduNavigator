interface MultiSelectOption {
  value: string;
  label: string;
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
            className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
