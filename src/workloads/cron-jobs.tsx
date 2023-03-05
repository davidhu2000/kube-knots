import { type V1CronJob } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";

export function CronJobs() {
  return (
    <ResourceTable<V1CronJob>
      command="get_cron_jobs"
      headers={["Name", "Schedule", "Last Run"]}
      actions={["trigger", "edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.schedule}</TableCell>
          <TableCell>{formatDateString(item.status?.lastScheduleTime)}</TableCell>
        </>
      )}
    />
  );
}
