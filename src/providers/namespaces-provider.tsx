import type { V1Namespace } from "@kubernetes/client-node";
import { createContext, type PropsWithChildren, useContext, useState } from "react";

import { useResourceList } from "../hooks/use-resource-list";

interface NamespaceContextValues {
  currentNamespace: string | null;
  changeNamespace: (ns: string) => void;
  availableNamespaces: string[];
}

const NamespaceContext = createContext<NamespaceContextValues>({
  currentNamespace: null,
  changeNamespace: () => {
    throw new Error("Make sure to wrap the app with LanguageProvider");
  },
  availableNamespaces: [],
});

export const useNamespace = () => useContext(NamespaceContext);

export function NamespaceProvider({ children }: PropsWithChildren) {
  const [namespace, setNamespace] = useState<string | null>(null);

  const result = useResourceList<V1Namespace>("get_namespaces");

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
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
}
