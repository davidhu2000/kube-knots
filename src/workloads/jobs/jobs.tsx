import type { V1Job } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { formatDistance } from "date-fns";

import { Table, TableHeader, TableBody, TableCell } from "../../components/table";
import { useCurrentNamespace } from "../../namespaces/namespaces";

export function Jobs() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["jobs", namespace], () => {
    return invoke<{ items: V1Job[] }>(`get_jobs`, { namespace });
  });

  const data = result.data?.items ?? [];

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run"]} />
        <TableBody>
          {data.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>
                {item.status?.completionTime &&
                  formatDistance(new Date(item.status.completionTime), new Date(), {
                    addSuffix: true,
                  })}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
