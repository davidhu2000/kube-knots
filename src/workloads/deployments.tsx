import { type V1Deployment } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";

export function Deployments() {
  return (
    <ResourceTable<V1Deployment>
      command="get_deployments"
      headers={["Name", "Image", "Pods"]}
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
