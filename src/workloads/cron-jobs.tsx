import { type V1CronJob } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function CronJobs() {
  const {
    data: { items },
  } = useResourceList<V1CronJob>("get_cron_jobs");

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.schedule}</TableCell>
              <TableCell>
                {item.status?.lastScheduleTime &&
                  formatDistance(new Date(item.status.lastScheduleTime), new Date(), {
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
