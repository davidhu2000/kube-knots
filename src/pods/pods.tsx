import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";

export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {result.data?.items.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <td>{pod.metadata?.name}</td>
              <td>{pod.status?.phase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
