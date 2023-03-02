import type { V1ReplicaSet } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";

export function ReplicaSets() {
  return (
    <ResourceTable<V1ReplicaSet>
      command="get_replica_sets"
      headers={["Name", "Images", "Pods", "Actions"]}
      actions={["edit", "scale"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
          <TableCell>
            {item.status?.replicas} / {item.spec?.replicas}
          </TableCell>
        </>
      )}
    />
  );
}
