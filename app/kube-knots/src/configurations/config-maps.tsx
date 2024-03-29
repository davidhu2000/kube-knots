import type { V1ConfigMap } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";

export function ConfigMaps() {
  return (
    <ResourceTable<V1ConfigMap>
      command="get_config_maps"
      headers={["Name", "Created"]}
      actions={["edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
