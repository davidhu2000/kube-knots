import type { V1ObjectMeta } from "@kubernetes/client-node";
import { Suspense, lazy } from "react";

import { ActionButton, type Actions } from "../components/action-group";
import { QueryWrapper } from "../components/query-wrapper";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { type ResourceListCommands, useResourceList } from "../hooks/use-resource-list";

const ResourceEditDrawer = lazy(() =>
  import("./resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

type Resource = { kind?: string | undefined; metadata?: V1ObjectMeta };

interface ResourceListProps<T> {
  command: ResourceListCommands;
  headers: string[];
  actions: Actions[];
  renderData: (item: T) => JSX.Element;
}

function getPosition(length: number, index: number) {
  if (length === 1) {
    return "single";
  }

  if (index === 0) {
    return "left";
  }

  if (index === length - 1) {
    return "right";
  }

  return "middle";
}

export function ResourceTable<T extends Resource>({
  command,
  headers,
  actions,
  renderData,
}: ResourceListProps<T>) {
  const resourceListQuery = useResourceList<T>(command);

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    T,
    (typeof actions)[number]
  >();

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={headers} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              {renderData(item)}
              <TableCell>
                {actions.map((action, index) => {
                  const position = getPosition(actions.length, index);

                  return (
                    <ActionButton
                      key={action}
                      label={action}
                      position={position}
                      onClick={() => handleOpen(item, action)}
                    />
                  );
                })}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Form</div>}>
        {actions.includes("edit") && (
          <ResourceEditDrawer
            isOpen={action === "edit"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>
    </QueryWrapper>
  );
}
