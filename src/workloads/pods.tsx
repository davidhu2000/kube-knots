import type { V1Pod } from "@kubernetes/client-node";
import { useState, lazy, Suspense } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useGetResourceList } from "../queries/invoke";

const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);
export function Pods() {
  const {
    data: { items },
  } = useGetResourceList<V1Pod>("get_pods");

  const [podAction, setPodAction] = useState<"logs" | "edit" | null>(null);
  const [selectedPod, setSelectedPod] = useState<V1Pod | null>(null);

  const handleOpen = (pod: V1Pod, action: "logs" | "edit") => {
    setSelectedPod(pod);
    setPodAction(action);
  };
  const handleClose = () => {
    setSelectedPod(null);
    setPodAction(null);
  };

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
        <PodLogs
          isOpen={podAction === "logs"}
          handleClose={handleClose}
          selectedPod={selectedPod}
        />
      </Suspense>
      <Suspense fallback={<div>Loading Form</div>}>
        <ResourceEditDrawer
          isOpen={podAction === "edit"}
          handleClose={handleClose}
          selectedResource={selectedPod}
        />
      </Suspense>
    </div>
  );
}
