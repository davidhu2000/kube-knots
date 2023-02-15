import { type V1Ingress } from "@kubernetes/client-node";
import { Suspense } from "react";

import { ActionGroup, ActionButton } from "../components/action-group";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

export function Ingresses() {
  const {
    data: { items },
  } = useResourceList<V1Ingress>("get_ingresses");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1Ingress, "edit">();

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Image", "Pods", "Actions"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>hi</TableCell>
              <TableCell>hi</TableCell>
              <TableCell>
                <ActionGroup>
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
    </div>
  );
}
