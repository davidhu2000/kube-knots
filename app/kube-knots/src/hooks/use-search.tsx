import type { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useCallback, useState } from "react";

import { type ResourceBase } from "../components/resource-table";

export function SearchInput(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) {
  return (
    <input
      {...props}
      placeholder="Search"
      className="ml-auto mb-2 block h-8 w-40 rounded-md border-gray-300 p-2 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-slate-500 sm:text-sm"
    />
  );
}

export function useSearch<T extends ResourceBase>({ data }: { data: T[] }) {
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  // TODO: maybe expand this to filter on other fields?
  const filteredData = data.filter((item) => {
    if (search === "") {
      return true;
    }

    // fallback to simple string search if regex is invalid
    try {
      return new RegExp(search, "i").test(item.metadata?.name || "");
    } catch (e) {
      return item.metadata?.name?.toLowerCase().includes(search.toLowerCase());
    }
  });

  return { filteredData, search, handleSearch };
}
