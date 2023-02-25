import type { NodeMetric, V1Node } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";

import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function Nodes() {
  const {
    data: { items },
  } = useResourceList<V1Node>("get_nodes");

  const {
    data: { items: nodeMetrics },
  } = useResourceList<NodeMetric>("get_node_metrics");

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "CPU", "Memory", "Pods", "Created"]} />
        <TableBody>
          {items.map((item) => {
            const metric = nodeMetrics.find((m) => m.metadata?.name === item.metadata?.name);

            const requests = item.status?.capacity;
            const usage = metric?.usage;

            return (
              <tr key={item.metadata?.name}>
                <TableCell>{item.metadata?.name}</TableCell>

                <TableCell>
                  <CpuUsage usage={usage?.cpu} request={requests?.cpu} />
                </TableCell>
                <TableCell>
                  <MemoryUsage usage={usage?.memory} request={requests?.memory} />
                </TableCell>

                <TableCell>{requests?.pods}</TableCell>

                <TableCell>
                  {item.metadata?.creationTimestamp &&
                    formatDistance(new Date(item.metadata?.creationTimestamp), new Date(), {
                      addSuffix: true,
                    })}
                </TableCell>
              </tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
