import { type V1Ingress } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";
import { Suspense } from "react";

import { ActionGroup, ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

export function Ingresses() {
  const resourceListQuery = useResourceList<V1Ingress>("get_ingresses");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1Ingress, "edit">();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Hosts", "Created", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.rules?.map((rule) => rule.host).join(",")}</TableCell>
              <TableCell>
                {item.metadata?.creationTimestamp &&
                  formatDistance(new Date(item.metadata.creationTimestamp), new Date(), {
                    addSuffix: true,
                  })}
              </TableCell>
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
    </QueryWrapper>
  );
}
