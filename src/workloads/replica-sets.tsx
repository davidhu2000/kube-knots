import type { V1ReplicaSet } from "@kubernetes/client-node";

import { QueryWrapper } from "../components/query-wrapper";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function ReplicaSets() {
  const resourceListQuery = useResourceList<V1ReplicaSet>("get_replica_sets");

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Images", "Pods"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template?.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.replicas} / {item.spec?.replicas}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </QueryWrapper>
  );
}
