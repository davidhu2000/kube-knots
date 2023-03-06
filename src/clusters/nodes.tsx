import type { NodeMetric, V1Node } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceList } from "../hooks/use-resource-list";

export function Nodes() {
  const {
    data: { items: nodeMetrics },
  } = useResourceList<NodeMetric>("get_node_metrics");

  return (
    <ResourceTable<V1Node>
      command="get_nodes"
      headers={["Name", "CPU", "Memory", "Status", "Created"]}
      actions={["edit", "cordon", "uncordon", "delete"]}
      renderData={(item) => {
        const metric = nodeMetrics.find((m) => m.metadata?.name === item.metadata?.name);

        const requests = item.status?.capacity;
        const usage = metric?.usage;

        const conditions = item.status?.conditions?.find((c) => c.status === "True");
        const status = item.spec?.unschedulable ? "Cordoned" : conditions?.type;

        return (
          <>
            <TableCell>{item.metadata?.name}</TableCell>
            <TableCell>
              <CpuUsage usage={usage?.cpu} request={requests?.cpu} simpleLabel={true} />
            </TableCell>
            <TableCell>
              <MemoryUsage usage={usage?.memory} request={requests?.memory} simpleLabel={true} />
            </TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
          </>
        );
      }}
    />
  );
}
