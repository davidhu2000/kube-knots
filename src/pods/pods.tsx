import { BarsArrowDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { type PropsWithChildren, useState, lazy, Suspense } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

const PodEdit = lazy(() => import("./pod-edit").then((module) => ({ default: module.PodEdit })));
const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const pods = result.data?.items ?? [];

  const [podAction, setPodAction] = useState<"logs" | "edit" | null>(null);
  const [selectedPod, setSelectedPod] = useState<V1Pod | null>(null);

  const handleLogPanelOpen = (pod: V1Pod) => {
    setSelectedPod(pod);
    setPodAction("logs");
  };
  const handleLogPanelClose = () => {
    setSelectedPod(null);
    setPodAction(null);
  };

  const handleEditPodOpen = (pod: V1Pod) => {
    setSelectedPod(pod);
    setPodAction("edit");
  };
  const handleEditPodClose = () => {
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
                    Icon={BarsArrowDownIcon}
                    label="Logs"
                    position="left"
                    onClick={() => handleLogPanelOpen(pod)}
                  />
                  <ActionButton
                    Icon={PencilIcon}
                    label="Edit"
                    position="right"
                    onClick={() => handleEditPodOpen(pod)}
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
          handleClose={handleLogPanelClose}
          selectedPod={selectedPod}
        />
      </Suspense>
      <Suspense fallback={<div>Loading Form</div>}>
        <PodEdit
          isOpen={podAction === "edit"}
          handleClose={handleEditPodClose}
          selectedPod={selectedPod}
        />
      </Suspense>
    </div>
  );
}
