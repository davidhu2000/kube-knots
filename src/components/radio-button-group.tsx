import { RadioGroup } from "@headlessui/react";

interface RadioButtonGroupProp<T> {
  title: string;
  value: T;
  onChange: (value: T) => void;
  values: T[];
  numberOfColumns?: 1 | 3;
  textTransform?: "capitalize" | "lowercase" | "normal-case	" | "uppercase";
}

export function RadioButtonGroup<T extends string>({
  value,
  onChange,
  values,
  title,
  numberOfColumns = 3,
  textTransform = "capitalize",
}: RadioButtonGroupProp<T>) {
  return (
    <RadioGroup value={value} onChange={onChange} className="py-4">
      <RadioGroup.Label className="text-gray-900 dark:text-gray-100">{title}</RadioGroup.Label>
      <div className={`grid ${`grid-cols-${numberOfColumns}` as const} gap-2`}>
        {values.map((value) => (
          <RadioGroup.Option
            key={value}
            value={value}
            className={({ checked }) =>
              `${
                checked
                  ? "dark:bg-blue-800 bg-blue-300 dark:text-gray-100 text-gray-900"
                  : "dark:bg-gray-800 bg-gray-200 dark:text-gray-100 text-gray-900"
              } flex cursor-pointer rounded-lg p-4 shadow-md`
            }
          >
            <div className="flex w-full items-center justify-center">
              <RadioGroup.Label as="p" className={`${textTransform} text-center`}>
                {value}
              </RadioGroup.Label>
            </div>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
