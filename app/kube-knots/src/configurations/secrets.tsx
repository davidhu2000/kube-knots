import type { V1Secret } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";

export function Secrets() {
  return (
    <ResourceTable<V1Secret>
      command="get_secrets"
      headers={["Name", "Type", "Created"]}
      actions={["edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
