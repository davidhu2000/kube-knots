import { type V1Service } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";

export function Services() {
  return (
    <ResourceTable<V1Service>
      command="get_services"
      headers={["Name", "Type"]}
      actions={["edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.type}</TableCell>
        </>
      )}
    />
  );
}
