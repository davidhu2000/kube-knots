import type { V1StatefulSet } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";

export function StatefulSets() {
  return (
    <ResourceTable<V1StatefulSet>
      command="get_stateful_sets"
      headers={["Name", "Images", "Pods"]}
      actions={["restart", "edit", "scale"]}
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
