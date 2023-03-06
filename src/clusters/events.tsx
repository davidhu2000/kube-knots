import type { CoreV1Event } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";

export function Events() {
  return (
    <ResourceTable<CoreV1Event>
      command="get_events"
      headers={["Reason", "Message", "Count", "Last Seen"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.reason}</TableCell>
          <TableCell>{item.message}</TableCell>
          <TableCell>{item.count}</TableCell>
          <TableCell>{formatDateString(item.lastTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
