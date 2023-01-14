import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";

const noPod = {
  metadata: {
    uid: "no-pods-found",
    name: "No pod found",
  },
  status: {
    phase: "---",
  },
};

export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const pods = result.data?.items?.length ? result.data?.items : [noPod];

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Status"]} />
        <TableBody>
          {pods.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <TableCell>{pod.metadata?.name}</TableCell>
              <TableCell> {pod.status?.phase}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
