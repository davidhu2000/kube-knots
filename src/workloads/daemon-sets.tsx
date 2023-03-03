import { type V1DaemonSet } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";

export function DaemonSets() {
  return (
    <ResourceTable<V1DaemonSet>
      command="get_daemon_sets"
      headers={["Name", "Pods", "Created", "Actions"]}
      actions={["restart", "edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.status?.numberReady}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
