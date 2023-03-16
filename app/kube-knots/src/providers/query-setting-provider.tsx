import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, type PropsWithChildren, useContext, useState, Suspense, lazy } from "react";

interface QuerySettingContext {
  refetchInternal: number;
  updateRefreshInterval: (refreshIntervalMs: number) => void;
  showDevtools: boolean;
  toggleDevtools: () => void;
}

const QuerySettingContext = createContext<QuerySettingContext>({
  refetchInternal: 2,
  updateRefreshInterval: () => {
    throw new Error("Make sure to wrap the app with ThemeProvider");
  },
  showDevtools: false,
  toggleDevtools: () => {
    throw new Error("Make sure to wrap the app with ThemeProvider");
  },
});

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

export const useQuerySetting = () => useContext(QuerySettingContext);

const storageKey = "query-refresh-interval";
const showDevtoolKey = "query-show-devtools";

export function QuerySettingProvider({ children }: PropsWithChildren) {
  const showDevtoolsLocal = localStorage.getItem(showDevtoolKey) === "true";
  const [showDevtools, setShowDevtools] = useState(showDevtoolsLocal);
  const refetchInternalLocal = localStorage.getItem(storageKey) || "2";
  const [refetchInternal, setRefetchInternal] = useState(parseInt(refetchInternalLocal, 10));
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: refetchInternal * 1000,
      },
    },
  });

  const updateRefreshInterval = (refreshInterval: number) => {
    setRefetchInternal(refreshInterval);
    localStorage.setItem(storageKey, refreshInterval.toString());
  };

  const toggleDevtools = () => {
    const newValue = !showDevtools;
    localStorage.setItem(showDevtoolKey, newValue.toString());
    setShowDevtools(newValue);
  };

  return (
    <QuerySettingContext.Provider
      value={{ refetchInternal, updateRefreshInterval, showDevtools, toggleDevtools }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </QuerySettingContext.Provider>
  );
}
