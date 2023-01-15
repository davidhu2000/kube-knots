import type { V1Deployment } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

export function Deployments() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["deployments", namespace], () => {
    return invoke<{ items: V1Deployment[] }>(`get_deployments`, { namespace });
  });

  const data = result.data?.items ?? [];

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Image", "Pods"]} />
        <TableBody>
          {data.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.availableReplicas} / {item.status?.replicas}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
