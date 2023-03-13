import { type V1Ingress } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { formatDateString } from "../helpers/date-helpers";

export function Ingresses() {
  return (
    <ResourceTable<V1Ingress>
      command="get_ingresses"
      headers={["Name", "Hosts", "Created"]}
      actions={["edit", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.rules?.map((rule) => rule.host).join(",")}</TableCell>
          <TableCell>{formatDateString(item.metadata?.creationTimestamp)}</TableCell>
        </>
      )}
    />
  );
}
