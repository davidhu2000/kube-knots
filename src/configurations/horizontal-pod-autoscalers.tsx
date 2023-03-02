import type { V1HorizontalPodAutoscaler } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";

export function HorizontalPodAutoscalers() {
  return (
    <ResourceTable<V1HorizontalPodAutoscaler>
      command={"get_horizontal_pod_autoscalers"}
      headers={["Name", "Metrics", "Min Pods", "Current", "Max Pods", "Created", "Actions"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>
            {item.status?.currentCPUUtilizationPercentage}% /{" "}
            {item.spec?.targetCPUUtilizationPercentage}%
          </TableCell>
          <TableCell>{item.spec?.minReplicas}</TableCell>
          <TableCell>{item.status?.currentReplicas}</TableCell>
          <TableCell>{item.spec?.maxReplicas}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
