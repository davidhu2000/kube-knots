import { invoke } from "@tauri-apps/api";
import { useQuery } from "@tanstack/react-query";

import type { V1Pod } from "@kubernetes/client-node";

export function Pods() {
  const result = useQuery(["pods"], () =>
    invoke<{ items: V1Pod[] }>("get_pods")
  );

  if (!result.isSuccess) {
    return <div>Error</div>;
  }

  return (
    <table>
      <thead>
        <th>Name</th>
        <th>Status</th>
      </thead>
      <tbody>
        {result.data.items.map((pod) => (
          <tr>
            <td>{pod.metadata?.name}</td>
            <td>{pod.status?.phase}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
