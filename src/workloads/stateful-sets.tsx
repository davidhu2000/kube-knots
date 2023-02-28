import type { V1StatefulSet } from "@kubernetes/client-node";
import { lazy, Suspense } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ScaleModal } from "../components/scale-modal";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";
import { restartMutation } from "./restart-mutation";

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

export function StatefulSets() {
  const resourceListQuery = useResourceList<V1StatefulSet>("get_stateful_sets");

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1StatefulSet,
    "edit" | "scale"
  >();

  const restartResource = restartMutation("stateful_set");

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Image", "Pods", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
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
                    onClick={() => restartResource.mutate(item)}
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
          <ScaleModal isOpen={action === "scale"} handleClose={handleClose} resource={selected} />
        )}
      </Suspense>
    </QueryWrapper>
  );
}
