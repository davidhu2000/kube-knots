import type { V1ReplicaSet } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { Table, TableHeader, TableBody, TableCell } from "../../components/table";
import { useCurrentNamespace } from "../../namespaces/namespaces";

export function ReplicaSets() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["replica-sets", namespace], () => {
    return invoke<{ items: V1ReplicaSet[] }>(`get_replica_sets`, { namespace });
  });

  const data = result.data?.items ?? [];

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Images", "Pods"]} />
        <TableBody>
          {data.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.replicas} / {item.spec?.replicas}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
