import type { V1ReplicaSet } from "@kubernetes/client-node";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceList } from "../hooks/use-resource-list";

export function ReplicaSets() {
  const {
    data: { items },
  } = useResourceList<V1ReplicaSet>("get_replica_sets");

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Images", "Pods"]} />
        <TableBody>
          {items.map((item) => (
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
    </div>
  );
}
