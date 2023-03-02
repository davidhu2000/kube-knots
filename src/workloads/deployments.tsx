import { type V1Deployment } from "@kubernetes/client-node";

import { ResourceTable } from "../components/resource-table";
import { TableCell } from "../components/table";

export function Deployments() {
  return (
    <ResourceTable<V1Deployment>
      command="get_deployments"
      headers={["Name", "Image", "Pods", "Actions"]}
      actions={["restart", "edit", "scale"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
          <TableCell>
            {item.status?.availableReplicas} / {item.status?.replicas}
          </TableCell>
        </>
      )}
    />
  );
}
