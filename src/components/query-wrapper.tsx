import { type PropsWithChildren } from "react";

import { type useResourceList } from "../hooks/use-resource-list";

interface QueryWrapperProps extends Required<PropsWithChildren> {
  query: ReturnType<typeof useResourceList>;
}

interface WrapperContentProps {
  title: string;
  subtitle: string;
  action?: JSX.Element;
}

function WrapperContent({ title, subtitle, action }: WrapperContentProps) {
  return (
    <div className="p-8 text-center">
      <p className="text-base font-semibold dark:text-gray-400">{subtitle}</p>
      <h1 className="my-4 text-2xl font-bold tracking-tight dark:text-gray-400">{title}</h1>
      {action}
    </div>
  );
}

export function QueryWrapper({ query, children }: QueryWrapperProps) {
  // TODO: improve the UI for these states
  if (query.isLoading) {
    return <WrapperContent title="Loading..." subtitle="..." />;
  }

  if (query.isError) {
    return (
      <WrapperContent
        title={JSON.stringify(query.error)}
        subtitle="Uh Oh"
        action={
          <button
            onClick={() => location.reload()}
            className="rounded-md border bg-blue-200 px-4 py-2 text-gray-900 shadow-md hover:bg-blue-300 dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
          >
            Reload
          </button>
        }
      />
    );
  }

  <button
    onClick={() => location.reload()}
    className="rounded-md border bg-blue-200 px-4 py-2 text-gray-900 shadow-md hover:bg-blue-300 dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
  >
    Reload
  </button>;

  if (query.isSuccess && query.data.items.length === 0) {
    return <WrapperContent title="No resources found" subtitle="404" />;
  }

  return <div>{children}</div>;
}
