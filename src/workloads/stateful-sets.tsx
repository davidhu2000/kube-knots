import type { V1StatefulSet } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { ScaleModal } from "../components/scale-modal";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";
import { useGetResourceList } from "../queries/invoke";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

type Actions = "edit" | "logs" | "scale";

export function StatefulSets() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(
    ["deployments", namespace],
    () => {
      return invoke<{ items: V1StatefulSet[] }>(`get_stateful_sets`, { namespace });
    },
    { refetchInterval: 1000 }
  );

  const {
    data: { items },
  } = useGetResourceList<V1StatefulSet>("get_stateful_sets");

  const [action, setAction] = useState<Actions | null>(null);
  const [selected, setSelected] = useState<V1StatefulSet | null>(null);

  const handleOpen = (deployment: V1StatefulSet, action: Actions) => {
    setSelected(deployment);
    setAction(action);
  };

  const handleClose = () => {
    setSelected(null);
    setAction(null);
  };

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Image", "Pods", "Actions"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.availableReplicas} / {item.status?.replicas}
              </TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    label="logs"
                    position="left"
                    onClick={() => handleOpen(item, "logs")}
                  />
                  <ActionButton
                    label="edit"
                    position="middle"
                    onClick={() => handleOpen(item, "edit")}
                  />
                  <ActionButton
                    label="scale"
                    position="right"
                    onClick={() => handleOpen(item, "scale")}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Editor</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>

      <Suspense fallback={<div>Loading Scale Form</div>}>
        {selected && (
          <ScaleModal isOpen={action === "scale"} handleClose={handleClose} deployment={selected} />
        )}
      </Suspense>
    </div>
  );
}
