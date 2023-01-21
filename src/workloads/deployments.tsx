import type { V1Deployment } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { ScaleModal } from "../components/scale-modal";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useGetResourceList } from "../queries/invoke";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function Deployments() {
  const {
    data: { items },
  } = useGetResourceList<V1Deployment>("get_deployments");

  const restartMutation = useMutation({
    mutationFn: (deployment: V1Deployment) => {
      return invoke("restart_deployment", {
        namespace: deployment.metadata?.namespace,
        name: deployment.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      alert(`Restarted deployment ${variables.metadata?.name}`);
    },
  });

  const [action, setAction] = useState<"edit" | "scale" | null>(null);
  const [selected, setSelected] = useState<V1Deployment | null>(null);

  const handleOpen = (deployment: V1Deployment, action: "edit" | "scale") => {
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
                    label="restart"
                    position="left"
                    onClick={() => restartMutation.mutate(item)}
                  />
                  <ActionButton
                    label="scale"
                    position="middle"
                    onClick={() => handleOpen(item, "scale")}
                  />
                  <ActionButton
                    label="edit"
                    position="right"
                    onClick={() => handleOpen(item, "edit")}
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
