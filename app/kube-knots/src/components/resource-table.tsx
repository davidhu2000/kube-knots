import type { V1ObjectMeta } from "@kubernetes/client-node";
import { Suspense, lazy } from "react";

import { useResourceActions } from "../hooks/use-resource-actions";
import { type ResourceListCommands, useResourceList } from "../hooks/use-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";
import { ActionMenuItem, ActionMenuWrapper, type Actions } from "./base/action-group";
import { Table, TableHeader, TableBody } from "./base/table";
import { PathnameTitle } from "./pathname-title";
import { QueryWrapper } from "./query-wrapper";

const ResourceCreateEditDrawer = lazy(() =>
  import("./resource-create-edit-drawer").then((module) => ({
    default: module.ResourceCreateEditDrawer,
  }))
);
const ResourceTriggerModal = lazy(() =>
  import("./resource-trigger-modal").then((module) => ({ default: module.ResourceTriggerModal }))
);
const ResourceDeleteModal = lazy(() =>
  import("./resource-delete-modal").then((module) => ({ default: module.ResourceDeleteModal }))
);
const ResourceScaleModal = lazy(() =>
  import("./resource-scale-modal").then((module) => ({ default: module.ResourceScaleModal }))
);
const ResourceRestartModal = lazy(() =>
  import("./resource-restart-modal").then((module) => ({ default: module.ResourceRestartModal }))
);
const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

export type ResourceBase = { kind?: string | undefined; metadata?: V1ObjectMeta };

interface ResourceListProps<T> {
  command: ResourceListCommands;
  headers: string[];
  actions: Actions[];
  renderData: (item: T) => JSX.Element;
  sortData?: (itemOne: T, itemTwo: T) => -1 | 0 | 1;
}

export function ResourceTable<T extends ResourceBase>({
  command,
  headers,
  actions,
  renderData,
  sortData,
}: ResourceListProps<T>) {
  const { selected, handleOpen, handleClose, action } = useResourceActions<
    T,
    (typeof actions)[number]
  >();

  const resourceListQuery = useResourceList<T>(command, undefined, { enabled: !action });

  const { filteredData, handleSearch, search } = useSearch({
    data: resourceListQuery.data?.items || [],
  });

  const sortedData = filteredData.sort(sortData);

  return (
    <QueryWrapper
      queryIsSuccess={resourceListQuery.isSuccess}
      queryIsLoading={resourceListQuery.isLoading}
      queryIsError={resourceListQuery.isError}
      queryError={resourceListQuery.error}
      queryDataLength={resourceListQuery.data?.items.length || 0}
    >
      <div className="flex justify-between">
        <PathnameTitle />
        <SearchInput onChange={handleSearch} value={search} />
      </div>

      <Table>
        <TableHeader headers={[...headers, ...(actions.length > 0 ? [""] : [])]} />
        <TableBody>
          {sortedData.map((item) => (
            <tr key={item.metadata?.uid}>
              {renderData(item)}
              <td>
                {actions.length > 0 && (
                  <ActionMenuWrapper>
                    {actions.map((action) => {
                      return (
                        <ActionMenuItem
                          key={action}
                          label={action}
                          onClick={() => handleOpen(item, action)}
                        />
                      );
                    })}
                  </ActionMenuWrapper>
                )}
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Form</div>}>
        {actions.includes("edit") && (
          <ResourceCreateEditDrawer
            action="update"
            isOpen={action === "edit"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Loading Trigger Modal</div>}>
        {actions.includes("trigger") && (
          <ResourceTriggerModal
            isOpen={action === "trigger"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>
      <Suspense fallback={<div>Loading Scale Modal</div>}>
        {actions.includes("scale") && (
          <ResourceScaleModal
            isOpen={action === "scale"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Loading Restart Modal</div>}>
        {actions.includes("restart") && (
          <ResourceRestartModal
            isOpen={action === "restart"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>
      <Suspense fallback={<div>Loading Deleted modal</div>}>
        {actions.includes("delete") && (
          <ResourceDeleteModal
            isOpen={action === "delete"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Loading Logs</div>}>
        {actions.includes("logs") && (
          <PodLogs isOpen={action === "logs"} handleClose={handleClose} selected={selected} />
        )}
      </Suspense>
    </QueryWrapper>
  );
}
