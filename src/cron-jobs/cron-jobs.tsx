import type { V1CronJob } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

const noData = {
  metadata: {
    uid: "no-cron-jobs-found",
    name: "No CronJobs found",
  },
  spec: {
    schedule: "---",
  },
  status: {
    lastScheduleTime: null,
  },
};

export function CronJobs() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["cron-jobs", namespace], () => {
    return invoke<{ items: V1CronJob[] }>(`get_cron_jobs`, { namespace });
  });

  const data = result.data?.items?.length ? result.data?.items : [noData];

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run"]} />
        <TableBody>
          {data.map((item) => (
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
