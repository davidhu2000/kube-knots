import type { V1StatefulSet } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { renderContainerImages } from "../helpers/table-helpers";

export function StatefulSets() {
  return (
    <ResourceTable<V1StatefulSet>
      command="get_stateful_sets"
      headers={["Name", "Images", "Pods"]}
      actions={["restart", "edit", "scale", "delete"]}
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
