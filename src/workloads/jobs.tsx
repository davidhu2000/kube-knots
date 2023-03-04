import type { V1Job } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";

export function Jobs() {
  return (
    <ResourceTable<V1Job>
      command="get_jobs"
      headers={["Name", "Schedule", "Last Run", "Actions"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
          <TableCell>{formatDateString(item.status?.completionTime)}</TableCell>
        </>
      )}
    />
  );
}
