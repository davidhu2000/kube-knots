import type { NodeMetric, V1Node } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";
import { lazy, Suspense } from "react";

import { ActionGroup, ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function Nodes() {
  const resourceListQuery = useResourceList<V1Node>("get_nodes");

  const {
    data: { items: nodeMetrics },
  } = useResourceList<NodeMetric>("get_node_metrics");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1Node, "edit">();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "CPU", "Memory", "Status", "Created", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => {
            const metric = nodeMetrics.find((m) => m.metadata?.name === item.metadata?.name);

            const requests = item.status?.capacity;
            const usage = metric?.usage;

            const conditions = item.status?.conditions?.find((c) => c.status === "True");

            return (
              <tr key={item.metadata?.name}>
                <TableCell>{item.metadata?.name}</TableCell>

                <TableCell>
                  <CpuUsage usage={usage?.cpu} request={requests?.cpu} />
                </TableCell>
                <TableCell>
                  <MemoryUsage usage={usage?.memory} request={requests?.memory} />
                </TableCell>

                <TableCell>{conditions?.type}</TableCell>

                <TableCell>
                  {item.metadata?.creationTimestamp &&
                    formatDistance(new Date(item.metadata?.creationTimestamp), new Date(), {
                      addSuffix: true,
                    })}
                </TableCell>

                <TableCell>
                  <ActionGroup>
                    <ActionButton
                      label="edit"
                      position="single"
                      onClick={() => handleOpen(item, "edit")}
                    />
                  </ActionGroup>
                </TableCell>
              </tr>
            );
          })}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Form</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>
    </QueryWrapper>
  );
}
