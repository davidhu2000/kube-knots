import { type PropsWithChildren } from "react";

import { type useResourceList } from "../hooks/use-resource-list";

interface QueryWrapperProps extends Required<PropsWithChildren> {
  query: ReturnType<typeof useResourceList>;
}

export function QueryWrapper({ query, children }: QueryWrapperProps) {
  // TODO: improve the UI for these states
  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>;
  }

  if (query.isSuccess && query.data.items.length === 0) {
    return <div>No resources found</div>;
  }

  return <div>{children}</div>;
}
