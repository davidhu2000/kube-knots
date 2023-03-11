import type { V1ReplicaSet } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { renderContainerImages } from "../helpers/table-helpers";

export function ReplicaSets() {
  return (
    <ResourceTable<V1ReplicaSet>
      command="get_replica_sets"
      headers={["Name", "Images", "Pods"]}
      actions={["edit", "scale", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{renderContainerImages(item.spec?.template?.spec?.containers)}</TableCell>
          <TableCell>
            {item.status?.replicas} / {item.spec?.replicas}
          </TableCell>
        </>
      )}
    />
  );
}
