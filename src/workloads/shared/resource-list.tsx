import type { V1Deployment, V1ReplicaSet, V1StatefulSet } from "@kubernetes/client-node";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup, Actions } from "../../components/action-group";
import { Table, TableHeader, TableBody, TableCell } from "../../components/table";
import { useCurrentNamespace } from "../../namespaces/namespaces";
import { ScaleModal } from "./scale-modal";

const ResourceEditDrawer = lazy(() =>
  import("../../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

type Resource = "deployment" | "replica_set" | "stateful_set";

interface ResourceListProps<T> {
  resourceName: Resource;
  actions: Actions[];
  headers: string[];
}

export function ResourceList<T extends V1Deployment | V1StatefulSet | V1ReplicaSet>({
  resourceName,
  actions,
  headers,
}: ResourceListProps<T>) {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(
    [resourceName, namespace],
    () => {
      return invoke<{ items: T[] }>(`get_${resourceName}s`, { namespace });
    },
    { refetchInterval: 1000 }
  );

  const restartMutation = useMutation({
    mutationFn: (resource: T) => {
      return invoke(`restart_${resourceName}`, {
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      alert(`Restarted ${variables.metadata?.name}`);
    },
  });

  const data = result.data?.items ?? [];

  const [action, setAction] = useState<(typeof actions)[number] | null>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const handleOpen = (deployment: T, action: (typeof actions)[number]) => {
    if (action === "restart") {
      restartMutation.mutate(deployment);
    }

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
        <TableHeader headers={headers.concat(actions.length > 0 ? ["Actions"] : [])} />
        <TableBody>
          {data.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.replicas} / {item.status?.replicas}
              </TableCell>
              {actions.length > 0 && (
                <TableCell>
                  <ActionGroup>
                    {actions.map((action, index) => (
                      <ActionButton
                        key={action}
                        label={action}
                        position={
                          index === 0 ? "left" : index === actions.length - 1 ? "right" : "middle"
                        }
                        onClick={() => handleOpen(item, action)}
                      />
                    ))}
                  </ActionGroup>
                </TableCell>
              )}
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
          <ScaleModal isOpen={action === "scale"} handleClose={handleClose} resource={selected} />
        )}
      </Suspense>
    </div>
  );
}
