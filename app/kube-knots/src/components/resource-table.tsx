import type { V1ObjectMeta } from "@kubernetes/client-node";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Suspense, lazy, useState, useMemo, useRef } from "react";
import { useVirtual } from "react-virtual";

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
  columns: ColumnDef<T>[];
}

export function ResourceTable<T extends ResourceBase>({
  command,
  headers,
  actions,
  renderData,
  columns,
}: ResourceListProps<T>) {
  const { selected, handleOpen, handleClose, action } = useResourceActions<
    T,
    (typeof actions)[number]
  >();

  const [sorting, setSorting] = useState<SortingState>([]);

  const resourceListQuery = useResourceList<T>(command, undefined, { enabled: !action });

  const { filteredData, handleSearch, search } = useSearch({
    data: resourceListQuery.data?.items || [],
  });

  const table = useReactTable<T>({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

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

      <div className="p-2">
        <div className="h-2" />
        <div ref={tableContainerRef} className="container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<T>;
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {actions.includes("edit") && (
        <Suspense fallback={<div>Loading Form</div>}>
          <ResourceCreateEditDrawer
            action="update"
            isOpen={action === "edit"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        </Suspense>
      )}

      {actions.includes("trigger") && (
        <Suspense fallback={<div>Loading Trigger Modal</div>}>
          <ResourceTriggerModal
            isOpen={action === "trigger"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        </Suspense>
      )}
      {actions.includes("scale") && (
        <Suspense fallback={<div>Loading Scale Modal</div>}>
          <ResourceScaleModal
            isOpen={action === "scale"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        </Suspense>
      )}

      {actions.includes("restart") && (
        <Suspense fallback={<div>Loading Restart Modal</div>}>
          <ResourceRestartModal
            isOpen={action === "restart"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        </Suspense>
      )}
      {actions.includes("delete") && (
        <Suspense fallback={<div>Loading Deleted modal</div>}>
          <ResourceDeleteModal
            isOpen={action === "delete"}
            handleClose={handleClose}
            selectedResource={selected}
          />
        </Suspense>
      )}

      {actions.includes("logs") && (
        <Suspense fallback={<div>Loading Logs</div>}>
          <PodLogs isOpen={action === "logs"} handleClose={handleClose} selected={selected} />
        </Suspense>
      )}
    </QueryWrapper>
  );
}
