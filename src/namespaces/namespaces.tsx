import type { V1Namespace } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { createContext, type PropsWithChildren, useContext, useState } from "react";

const NamespaceContext = createContext<string[]>([]);

export const useNamespace = () => useContext(NamespaceContext);

export function NamespaceProvider({ children }: PropsWithChildren) {
  const result = useQuery(["namespaces"], () => {
    return invoke<{ items: V1Namespace[] }>("get_namespaces");
  });

  const namespaces = result.data?.items.map((item) => item.metadata?.name ?? "");

  return <NamespaceContext.Provider value={namespaces ?? []}>{children}</NamespaceContext.Provider>;
}

const CurrentNamespaceContext = createContext<{
  namespace: string | undefined;
  updateNamespace: (ns: string) => void;
}>({ namespace: undefined, updateNamespace: () => null });

export const useCurrentNamespace = () => useContext(CurrentNamespaceContext);

export function CurrentNamespaceProvider({ children }: PropsWithChildren) {
  const [namespace, setNamespace] = useState<string | undefined>();

  const updateNamespace = (ns: string) => {
    // TODO: update to a const
    if (ns === "All namespaces") {
      setNamespace(undefined);
    } else {
      setNamespace(ns);
    }
  };

  return (
    <CurrentNamespaceContext.Provider value={{ namespace, updateNamespace }}>
      {children}
    </CurrentNamespaceContext.Provider>
  );
}
