import type { V1ConfigMap } from "@kubernetes/client-node";
import { Suspense } from "react";

import { ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

export function ConfigMaps() {
  const resourceListQuery = useResourceList<V1ConfigMap>("get_config_maps");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1ConfigMap, "edit">();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Created", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
              <TableCell>
                <ActionButton
                  label="edit"
                  position="single"
                  onClick={() => handleOpen(item, "edit")}
                />
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Form</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>
    </QueryWrapper>
  );
}
