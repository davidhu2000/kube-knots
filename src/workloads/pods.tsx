import { BarsArrowDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useState, lazy, Suspense } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);
export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const pods = result.data?.items ?? [];

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
          {pods.map((pod) => (
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
