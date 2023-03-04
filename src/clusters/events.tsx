import type { CoreV1Event } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";

export function Events() {
  return (
    <ResourceTable<CoreV1Event>
      command="get_events"
      headers={["Reason", "Message", "Last Seen", "Action"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.reason}</TableCell>
          <TableCell>{item.message}</TableCell>
          <TableCell>{formatDateString(item.lastTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
