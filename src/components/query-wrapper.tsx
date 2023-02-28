import { type PropsWithChildren } from "react";

import { type useResourceList } from "../hooks/use-resource-list";

interface QueryWrapperProps extends Required<PropsWithChildren> {
  query: ReturnType<typeof useResourceList>;
}

export function QueryWrapper({ query, children }: QueryWrapperProps) {
  // TODO: improve the UI for these states
  if (query.isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-semibold dark:text-gray-400">...</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight dark:text-gray-400">Loading...</h1>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-semibold dark:text-gray-400">Uh oh</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight dark:text-gray-400">
          {JSON.stringify(query.error)}
        </h1>
      </div>
    );
  }

  if (query.isSuccess && query.data.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-semibold dark:text-gray-400">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight dark:text-gray-400">
          No resource found
        </h1>
      </div>
    );
  }

  return <div>{children}</div>;
}
