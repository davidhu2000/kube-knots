import type { V1Namespace } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { createContext, type PropsWithChildren, useContext, useState } from "react";

import { useCurrentContext } from "./current-context-provider";

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
  const { currentContext } = useCurrentContext();
  const [namespace, setNamespace] = useState<string | null>(null);

  const result = useQuery(["namespaces", currentContext], () => {
    return invoke<{ items: V1Namespace[] }>("get_namespaces", { context: currentContext });
  });

  const changeNamespace = (ns: string | null) => {
    console.log(ns);
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
