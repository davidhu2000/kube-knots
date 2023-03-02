import type { V1Secret } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";

export function Secrets() {
  return (
    <ResourceTable<V1Secret>
      command={"get_secrets"}
      headers={["Name", "Created", "Actions"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
