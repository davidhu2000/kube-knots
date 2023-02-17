import type { V1Pod } from "@kubernetes/client-node";
import { lazy, Suspense } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);
export function Pods() {
  const {
    data: { items },
  } = useResourceList<V1Pod>("get_pods");

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1Pod,
    "logs" | "edit"
  >();

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Status", "Actions"]} />
        <TableBody>
          {items.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <TableCell>{pod.metadata?.name}</TableCell>
              <TableCell>{pod.status?.phase}</TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    label="logs"
                    position="left"
                    onClick={() => handleOpen(pod, "logs")}
                  />
                  <ActionButton
                    label="edit"
                    position="right"
                    onClick={() => handleOpen(pod, "edit")}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
      <Suspense fallback={<div>Loading Logs</div>}>
        <PodLogs isOpen={action === "logs"} handleClose={handleClose} selectedPod={selected} />
      </Suspense>
      <Suspense fallback={<div>Loading Form</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>
    </div>
  );
}
