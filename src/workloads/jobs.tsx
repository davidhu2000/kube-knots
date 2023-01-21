import type { V1Job } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function Jobs() {
  const {
    data: { items },
  } = useResourceList<V1Job>("get_jobs");

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.completionTime &&
                  formatDistance(new Date(item.status.completionTime), new Date(), {
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
