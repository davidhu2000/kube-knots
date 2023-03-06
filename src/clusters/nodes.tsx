import type { NodeMetric, V1Node, V1Pod } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceList } from "../hooks/use-resource-list";

// TODO: maybe not use resourceTable for this? it's very different compared to other resources
// for example: dynamiclly show cordon/uncordon based on node status
// node components are not used in other places, but still need to be imported
export function Nodes() {
  const {
    data: { items: nodeMetrics },
  } = useResourceList<NodeMetric>("get_node_metrics");

  const {
    data: { items: pods },
  } = useResourceList<V1Pod>("get_pods", false);

  return (
    <ResourceTable<V1Node>
      command="get_nodes"
      headers={["Name", "CPU", "Memory", "Status", "Pods", "Created"]}
      actions={["edit", "cordon", "uncordon", "delete"]}
      renderData={(item) => {
        const metric = nodeMetrics.find((m) => m.metadata?.name === item.metadata?.name);

        const requests = item.status?.capacity;
        const usage = metric?.usage;

        const conditions = item.status?.conditions
          ?.filter((c) => c.status === "True")
          .map((c) => c.type);
        const status = item.spec?.unschedulable ? "Cordoned" : conditions?.join(",");

        const nodePods = pods.filter((p) => p.spec?.nodeName === item.metadata?.name);

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
            <TableCell>{nodePods.length}</TableCell>
            <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
          </>
        );
      }}
    />
  );
}
