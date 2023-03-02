import type { V1ReplicaSet } from "@kubernetes/client-node";
import { lazy, Suspense } from "react";

import { ActionGroup, ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ScaleModal } from "../components/scale-modal";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function ReplicaSets() {
  const resourceListQuery = useResourceList<V1ReplicaSet>("get_replica_sets");

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1ReplicaSet,
    "edit" | "scale"
  >();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Images", "Pods", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.replicas} / {item.spec?.replicas}
              </TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    label="scale"
                    position="left"
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

      {selected && (
        <ScaleModal isOpen={action === "scale"} handleClose={handleClose} resource={selected} />
      )}
    </QueryWrapper>
  );
}
