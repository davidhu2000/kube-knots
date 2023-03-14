import type { V1Job } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";
import { renderContainerImages } from "../helpers/table-helpers";

export function Jobs() {
  return (
    <ResourceTable<V1Job>
      command="get_jobs"
      headers={["Name", "Schedule", "Last Run"]}
      actions={["edit", "delete"]}
      renderData={(item) => {
        return (
          <>
            <TableCell>{item.metadata?.name}</TableCell>
            <TableCell>{renderContainerImages(item.spec?.template.spec?.containers)}</TableCell>
            <TableCell>{formatDateString(item.status?.completionTime)}</TableCell>
          </>
        );
      }}
    />
  );
}
