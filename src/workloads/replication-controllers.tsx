import type { V1ReplicationController } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";

export function ReplicationControllers() {
  return (
    <ResourceTable<V1ReplicationController>
      command="get_replication_controllers"
      headers={["Name", "Image", "Pods"]}
      actions={["restart", "edit", "scale", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
          <TableCell>
            {item.status?.availableReplicas} / {item.status?.replicas}
          </TableCell>
        </>
      )}
    />
  );
}
