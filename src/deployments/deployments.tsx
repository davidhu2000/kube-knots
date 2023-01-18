import { ArrowPathIcon, PencilIcon } from "@heroicons/react/20/solid";
import type { V1Deployment } from "@kubernetes/client-node";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function Deployments() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(
    ["deployments", namespace],
    () => {
      return invoke<{ items: V1Deployment[] }>(`get_deployments`, { namespace });
    },
    { refetchInterval: 1000 }
  );

  const data = result.data?.items ?? [];

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

  const [selected, setSelected] = useState<V1Deployment | null>(null);

  const handleEditOpen = (deployment: V1Deployment) => {
    setSelected(deployment);
  };
  const handleEditClose = () => {
    setSelected(null);
  };

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Image", "Pods", "Actions"]} />
        <TableBody>
          {data.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.availableReplicas} / {item.status?.replicas}
              </TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    Icon={ArrowPathIcon}
                    label="Restart"
                    position="left"
                    onClick={() => restartMutation.mutate(item)}
                  />
                  <ActionButton
                    Icon={PencilIcon}
                    label="Edit"
                    position="right"
                    onClick={() => handleEditOpen(item)}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Editor</div>}>
        <ResourceEditDrawer
          isOpen={!!selected}
          handleClose={handleEditClose}
          selectedResource={selected}
        />
      </Suspense>
    </div>
  );
}
