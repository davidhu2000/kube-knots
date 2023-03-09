import type { PodMetric, V1Pod } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { useResourceList } from "../hooks/use-resource-list";

export function Pods() {
  const {
    data: { items: metrics },
  } = useResourceList<PodMetric>("get_pod_metrics");

  return (
    <ResourceTable<V1Pod>
      command="get_pods"
      headers={["Name", "Status", "CPU", "Memory"]}
      actions={["logs", "edit", "delete"]}
      renderData={(item) => {
        const metric = metrics.find((metric) => metric.metadata.name === item.metadata?.name);

        // TODO: handle multiple containers
        const usage = metric?.containers[0].usage;
        const requests = item.spec?.containers[0].resources?.requests;

        return (
          <>
            <TableCell>{item.metadata?.name}</TableCell>
            <TableCell>{item.status?.phase}</TableCell>
            <TableCell>
              <CpuUsage usage={usage?.cpu} request={requests?.cpu} simpleLabel={true} />
            </TableCell>
            <TableCell>
              <MemoryUsage usage={usage?.memory} request={requests?.memory} simpleLabel={true} />
            </TableCell>
          </>
        );
      }}
    />
  );
}
