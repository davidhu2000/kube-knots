import type { CoreV1Event } from "@kubernetes/client-node";

import { QueryWrapper } from "../components/query-wrapper";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceList } from "../hooks/use-resource-list";

export function Events() {
  const resourceListQuery = useResourceList<CoreV1Event>("get_events");

  const events = resourceListQuery.data.items.sort((a, b) => {
    if (a.lastTimestamp && b.lastTimestamp) {
      return new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime();
    }
    return 0;
  });

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Reason", "Message", "Source", "Last Seen"]} />
        <TableBody>
          {events.map((item) => (
            <tr key={item.message}>
              <TableCell>{item.reason}</TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell>{item.source?.component}</TableCell>
              <TableCell>{formatDateString(item.lastTimestamp)}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </QueryWrapper>
  );
}
