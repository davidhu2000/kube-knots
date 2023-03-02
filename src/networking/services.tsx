import { type V1Service } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";

export function Services() {
  return (
    <ResourceTable<V1Service>
      command="get_services"
      headers={["Name", "Type", "Actions"]}
      actions={["edit"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.type}</TableCell>
        </>
      )}
    />
  );
}
