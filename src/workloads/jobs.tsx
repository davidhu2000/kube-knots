import type { V1Job } from "@kubernetes/client-node";

import { QueryWrapper } from "../components/query-wrapper";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { formatDateString } from "../helpers/date-helpers";
import { useResourceList } from "../hooks/use-resource-list";

export function Jobs() {
  const resourceListQuery = useResourceList<V1Job>("get_jobs");

  return (
    <QueryWrapper query={resourceListQuery}>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run"]} />
        <TableBody>
          {resourceListQuery.data.items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.template.spec?.containers[0].image}</TableCell>
              <TableCell>{formatDateString(item.status?.completionTime)}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </QueryWrapper>
  );
}
