import type { NodeMetric, V1Pod, V1Node } from "@kubernetes/client-node";
import { lazy, Suspense } from "react";

import { ActionMenuWrapper, ActionMenuItem, type Actions } from "../components/base/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/base/table";
import { QueryWrapper } from "../components/query-wrapper";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

const NodeCordonModal = lazy(() =>
  import("./node-action-modal").then((module) => ({ default: module.NodeActionModal }))
);
const NodeDrainModal = lazy(() =>
  import("./node-drain-modal").then((module) => ({ default: module.NodeDrainModal }))
);
const ResourceCreateEditDrawer = lazy(() =>
  import("../components/resource-create-edit-drawer").then((module) => ({
    default: module.ResourceCreateEditDrawer,
  }))
);
const ResourceDeleteModal = lazy(() =>
  import("../components/resource-delete-modal").then((module) => ({
    default: module.ResourceDeleteModal,
  }))
);

export type NodeActions = "cordon" | "drain" | "uncordon";

export function Nodes() {
  const nodeQuery = useResourceList<V1Node>("get_nodes");
  const nodes = nodeQuery.data?.items || [];

  const nodeMetricQuery = useResourceList<NodeMetric>("get_node_metrics");
  const nodeMetrics = nodeMetricQuery.data?.items || [];

  const podsQuery = useResourceList<V1Pod>("get_pods", false);
  const pods = podsQuery.data?.items || [];

  const actions: (Actions | NodeActions)[] = ["edit", "cordon", "uncordon", "drain", "delete"];

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1Node,
    (typeof actions)[number]
  >();

  return (
    <QueryWrapper
      queryIsSuccess={nodeQuery.isSuccess}
      queryIsLoading={nodeQuery.isLoading}
      queryIsError={nodeQuery.isError}
      queryError={nodeQuery.error}
      queryDataLength={nodeQuery.data?.items.length || 0}
    >
      <Table>
        <TableHeader headers={["Name", "CPU", "Memory", "Status", "Pods", "Created", ""]} />
        <TableBody>
          {nodes.map((item) => {
            const metric = nodeMetrics.find((m) => m.metadata?.name === item.metadata?.name);

            const requests = item.status?.capacity;
            const usage = metric?.usage;

            const conditions = item.status?.conditions
              ?.filter((c) => c.status === "True")
              .map((c) => c.type);
            const status = item.spec?.unschedulable ? "Cordoned" : conditions?.join(",");

            const nodePods = pods.filter((p) => p.spec?.nodeName === item.metadata?.name);

            const nodeActions = actions.filter((a) => {
              if (a === "cordon" && item.spec?.unschedulable) {
                return false;
              }
              if (a === "uncordon" && !item.spec?.unschedulable) {
                return false;
              }
              return true;
            });

            return (
              <tr key={item.metadata?.uid}>
                <TableCell>{item.metadata?.name}</TableCell>
                <TableCell>
                  <CpuUsage usage={usage?.cpu} request={requests?.cpu} simpleLabel={true} />
                </TableCell>
                <TableCell>
                  <MemoryUsage
                    usage={usage?.memory}
                    request={requests?.memory}
                    simpleLabel={true}
                  />
                </TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>{nodePods.length}</TableCell>
                <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
                <td>
                  <ActionMenuWrapper>
                    {nodeActions.map((action) => {
                      return (
                        <ActionMenuItem
                          key={action}
                          label={action}
                          onClick={() => handleOpen(item, action)}
                        />
                      );
                    })}
                  </ActionMenuWrapper>
                </td>
              </tr>
            );
          })}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Form</div>}>
        {actions.includes("edit") && (
          <ResourceCreateEditDrawer
            action="update"
            isOpen={action === "edit"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Loading Deleted modal</div>}>
        {actions.includes("delete") && (
          <ResourceDeleteModal
            isOpen={action === "delete"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>
      <Suspense fallback={<div>Loading Cordon modal</div>}>
        {(action === "cordon" || action === "uncordon") && (
          <NodeCordonModal
            isOpen={["cordon", "uncordon"].includes(action ?? "")}
            handleClose={handleClose}
            selectedResource={selected}
            action={action}
          />
        )}
      </Suspense>
      <Suspense fallback={<div>Loading Drain modal</div>}>
        {action === "drain" && (
          <NodeDrainModal
            isOpen={action === "drain"}
            handleClose={handleClose}
            selectedResource={selected}
            pods={pods}
          />
        )}
      </Suspense>
    </QueryWrapper>
  );
}
