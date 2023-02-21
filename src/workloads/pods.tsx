import type { V1Pod } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { type ChangeEvent, lazy, Suspense, useEffect, useRef, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Drawer } from "../components/drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";
import { useScrollBottom } from "../hooks/use-scroll-bottom";
import { PodTerminal } from "./pod-terminal";

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
    "edit" | "exec" | "logs"
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
                    label="exec"
                    position="middle"
                    onClick={() => handleOpen(pod, "exec")}
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
      <Suspense fallback={<div>Loading Drawer</div>}>
        <Drawer
          isOpen={action === "exec"}
          handleClose={handleClose}
          title="Terminal"
          // TODO: support multiple containers
          description={`Terminal for ${selected?.metadata?.name} - ${selected?.spec?.containers[0]?.name}`}
        >
          {selected && <PodTerminal pod={selected} />}
        </Drawer>
      </Suspense>
    </div>
  );
}
