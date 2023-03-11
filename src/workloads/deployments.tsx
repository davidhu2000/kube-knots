import { type V1Deployment } from "@kubernetes/client-node";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { renderContainerImages } from "../helpers/table-helpers";

export function Deployments() {
  return (
    <ResourceTable<V1Deployment>
      command="get_deployments"
      headers={["Name", "Image", "Pods"]}
      actions={["restart", "edit", "scale", "delete"]}
      renderData={(item) => (
        <>
          <TableCell>{item.metadata?.name}</TableCell>
          <TableCell>{renderContainerImages(item.spec?.template.spec?.containers)}</TableCell>
          <TableCell>
            {item.status?.availableReplicas} / {item.status?.replicas}
          </TableCell>
        </>
      )}
    />
  );
}
