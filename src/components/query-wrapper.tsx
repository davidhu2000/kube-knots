import { type PropsWithChildren } from "react";

import { type useResourceList } from "../hooks/use-resource-list";

interface QueryWrapperProps extends Required<PropsWithChildren> {
  query: ReturnType<typeof useResourceList>;
}

function WrapperContent({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-8 text-center">
      <p className="text-base font-semibold dark:text-gray-400">{subtitle}</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight dark:text-gray-400">{title}</h1>
    </div>
  );
}

export function QueryWrapper({ query, children }: QueryWrapperProps) {
  // TODO: improve the UI for these states
  if (query.isLoading) {
    return <WrapperContent title="Loading..." subtitle="..." />;
  }

  if (query.isError) {
    return <WrapperContent title={JSON.stringify(query.error)} subtitle="Uh Oh" />;
  }

  if (query.isSuccess && query.data.items.length === 0) {
    return <WrapperContent title="No resources found" subtitle="404" />;
  }

  return <div>{children}</div>;
}
