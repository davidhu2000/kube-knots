import type { V1Secret } from "@kubernetes/client-node";
import { formatDistance } from "date-fns";
import { Suspense } from "react";

import { ActionButton } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

export function Secrets() {
  const resourceListQuery = useResourceList<V1Secret>("get_secrets");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1Secret, "edit">();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Created", "Actions"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>
                {item.metadata?.creationTimestamp &&
                  formatDistance(new Date(item.metadata.creationTimestamp), new Date(), {
                    addSuffix: true,
                  })}
              </TableCell>
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
