import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

import { AppProviders } from "./app-providers";
import { router } from "./router";

const queryClient = new QueryClient();

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

export function App() {
  const [showDevtools, setShowDevtools] = useState(false);

  // TODO: set up a provider for this so we can toggle it from anywhere
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore this is a hack to make it easier to toggle devtools in production
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </AppProviders>
    </QueryClientProvider>
  );
}
