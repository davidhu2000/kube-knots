import { RadioGroup } from "@headlessui/react";

interface RadioButtonGroupProp<T> {
  title: string;
  value: T;
  onChange: (value: T) => void;
  values: T[];
  numberOfColumns?: 1 | 3;
}

export function RadioButtonGroup<T extends string>({
  value,
  onChange,
  values,
  title,
  numberOfColumns = 3,
}: RadioButtonGroupProp<T>) {
  const gridClass = `grid-cols-${numberOfColumns}` as const;
  return (
    <RadioGroup value={value} onChange={onChange} className="py-4">
      <RadioGroup.Label className="text-gray-900 dark:text-gray-100">{title}</RadioGroup.Label>
      <div className={`grid ${gridClass} gap-2`}>
        {values.map((value) => (
          <RadioGroup.Option
            key={value}
            value={value}
            className={({ checked }) =>
              `${
                checked ? "bg-gray-800 text-white" : "bg-white"
              } flex cursor-pointer rounded-lg p-4 shadow-md`
            }
          >
            {({ checked }) => (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}
                    >
                      {value}
                    </RadioGroup.Label>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
