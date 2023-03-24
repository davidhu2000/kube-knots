import type { V1PodDisruptionBudget } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";

export function PodDisruptionBudgets() {
  return (
    <ResourceTable<V1PodDisruptionBudget>
      command="get_pod_disruption_budgets"
      headers={["Name", "Min Available", "Max Unavailable"]}
      actions={["edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.minAvailable}</TableCell>
          <TableCell>{item.spec?.maxUnavailable}</TableCell>
        </>
      )}
    />
  );
}
