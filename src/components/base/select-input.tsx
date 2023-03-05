import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface SelectProps<T> {
  options: T[];
  onChange: (value: T) => void;
  value: T | null;
  defaultLabel: string;
}

export function SelectInput<T extends string>({
  options,
  onChange,
  value,
  defaultLabel,
}: SelectProps<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions = [
    null,
    ...options.filter((option) => {
      return option.toLowerCase().includes(query.toLowerCase());
    }),
  ];

  return (
    <Combobox as="div" value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Combobox.Input
          className="h-10 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={defaultLabel}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-900">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 ${
                    active ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block cursor-pointer truncate`}>
                      {option ?? defaultLabel}
                    </span>

                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-600 dark:text-slate-300">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
