import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { useCurrentNamespace, useNamespace } from "./namespaces";

export function NamespaceSelect() {
  const [query, setQuery] = useState("");
  const { namespace, updateNamespace } = useCurrentNamespace();
  const namespaces = useNamespace();

  const filteredNamespaces = ["All namespaces"].concat(
    namespaces.filter((namespace) => {
      return namespace.toLowerCase().includes(query.toLowerCase());
    })
  );

  return (
    <Combobox as="div" value={namespace ?? "All namespaces"} onChange={updateNamespace}>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredNamespaces.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
            {filteredNamespaces.map((namespace) => (
              <Combobox.Option
                key={namespace}
                value={namespace}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${
                    active ? "bg-gray-200" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block cursor-pointer truncate`}>{namespace}</span>

                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-600">
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
