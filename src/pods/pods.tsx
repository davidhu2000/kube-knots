import { invoke } from "@tauri-apps/api";
import { useQuery } from "@tanstack/react-query";

import type { V1Pod } from "@kubernetes/client-node";
import { useState } from "react";
import { Namespaces } from "../namespaces/namespaces";

export function Pods() {
  const [namespace, setNamespace] = useState<string | undefined>(undefined);

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const handleNamespaceChange = (namespace: string) => {
    setNamespace(namespace);
  };

  return (
    <div>
      <Namespaces onChange={handleNamespaceChange} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {result.data?.items.map((pod) => (
            <tr>
              <td>{pod.metadata?.name}</td>
              <td>{pod.status?.phase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
