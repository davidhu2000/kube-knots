import type { V1HorizontalPodAutoscaler } from "@kubernetes/client-node";
import { Suspense } from "react";

import { ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

export function HorizontalPodAutoscalers() {
  const resourceListQuery = useResourceList<V1HorizontalPodAutoscaler>(
    "get_horizontal_pod_autoscalers"
  );

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1HorizontalPodAutoscaler,
    "edit"
  >();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader
          headers={["Name", "Metrics", "Min Pods", "Current", "Max Pods", "Created", "Actions"]}
        />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>
                {item.status?.currentCPUUtilizationPercentage}% /{" "}
                {item.spec?.targetCPUUtilizationPercentage}%
              </TableCell>
              <TableCell>{item.spec?.minReplicas}</TableCell>
              <TableCell>{item.status?.currentReplicas}</TableCell>
              <TableCell>{item.spec?.maxReplicas}</TableCell>

              <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
              <TableCell>
                <ActionButton
                  label="edit"
                  position="single"
                  onClick={() => handleOpen(item, "edit")}
                />
              </TableCell>
            </tr>
          ))}
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
