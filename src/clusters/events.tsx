import type { CoreV1Event } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function Events() {
  const {
    data: { items },
  } = useResourceList<CoreV1Event>("get_events");

  return (
    <div>
      <Table>
        <TableHeader headers={["Reason", "Message", "Source", "Last Seen"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.message}>
              <TableCell>{item.reason}</TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell>{item.source?.component}</TableCell>
              <TableCell>
                {item.lastTimestamp &&
                  formatDistance(new Date(item.lastTimestamp), new Date(), {
                    addSuffix: true,
                  })}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
