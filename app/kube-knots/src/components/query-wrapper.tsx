import { memo, useCallback, type PropsWithChildren } from "react";

interface WrapperContentProps {
  title: string;
  subtitle: string;
  action?: JSX.Element;
}

const WrapperContent = memo(function WrapperContent({
  title,
  subtitle,
  action,
}: WrapperContentProps) {
  return (
    <div className="p-8 text-center">
      <p className="text-base font-semibold dark:text-gray-400">{subtitle}</p>
      <h1 className="my-4 text-2xl font-bold tracking-tight dark:text-gray-400">{title}</h1>
      {action}
    </div>
  );
});

interface QueryWrapperProps extends Required<PropsWithChildren> {
  queryIsLoading: boolean;
  queryIsError: boolean;
  queryIsSuccess: boolean;
  queryError: unknown;
  queryDataLength: number;
}

export function QueryWrapper(props: QueryWrapperProps) {
  // TODO: improve the UI for these states
  if (props.queryIsLoading) {
    return <WrapperContent title="Loading..." subtitle="..." />;
  }

  if (props.queryIsError) {
    // TODO: update to account for linux and windows
    const handleClick = useCallback(() => {
      location.reload();
    }, []);

    return (
      <WrapperContent
        title={JSON.stringify(props.queryError)}
        subtitle="Uh Oh"
        action={
          <button
            onClick={handleClick}
            className="rounded-md border bg-blue-200 px-4 py-2 text-gray-900 shadow-md hover:bg-blue-300 dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
          >
            Reload
          </button>
        }
      />
    );
  }

  if (props.queryIsSuccess && props.queryDataLength === 0) {
    return <WrapperContent title="No resources found" subtitle="404" />;
  }

  return <div>{props.children}</div>;
}
