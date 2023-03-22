import type { V1Namespace } from "@kubernetes/client-node";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { createContext, type PropsWithChildren, useContext, useState } from "react";

import { useCurrentContext } from "./current-context-provider";

interface NamespaceContextValues {
  currentNamespace: string | null;
  changeNamespace: (ns: string) => void;
  availableNamespaces: string[];
  namespaceQuery: UseQueryResult<{ items: V1Namespace[] }> | null;
}

const NamespaceContext = createContext<NamespaceContextValues>({
  currentNamespace: null,
  changeNamespace: () => {
    throw new Error("Make sure to wrap the app with LanguageProvider");
  },
  availableNamespaces: [],
  namespaceQuery: null,
});

export const useNamespace = () => useContext(NamespaceContext);

export function NamespaceProvider({ children }: PropsWithChildren) {
  const [namespace, setNamespace] = useState<string | null>(null);

  const { currentContext } = useCurrentContext();
  const result = useQuery(
    ["get_namespaces", currentContext],
    () => {
      return invoke<{ items: V1Namespace[] }>("get_namespaces", {
        context: currentContext,
      });
    },
    { retry: false, refetchInterval: false }
  );

  const changeNamespace = (ns: string | null) => {
    setNamespace(ns);
  };

  const namespaces = result.data?.items.map((item) => item.metadata?.name ?? "");

  return (
    <NamespaceContext.Provider
      value={{
        currentNamespace: namespace,
        changeNamespace,
        availableNamespaces: namespaces ?? [],
        namespaceQuery: result,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
}
