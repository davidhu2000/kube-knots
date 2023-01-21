import type { V1StatefulSet } from "@kubernetes/client-node";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { ScaleModal } from "../components/scale-modal";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function StatefulSets() {
  const {
    data: { items },
  } = useResourceList<V1StatefulSet>("get_stateful_sets");

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1StatefulSet,
    "edit" | "logs" | "scale"
  >();

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
