import type { V1Ingress, V1Service } from "@kubernetes/client-node";

import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { useResourceList } from "../hooks/use-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";

export function NetworkingOverview() {
  const {
    data: { items: ingresses },
  } = useResourceList<V1Ingress>("get_ingresses");
  const {
    data: { items: services },
  } = useResourceList<V1Service>("get_services");

  const data = [...ingresses, ...services];

  const { filteredData, handleSearch, search } = useSearch({
    data,
  });

  return (
    <div>
      <SearchInput onChange={handleSearch} value={search} />
      <Table>
        <TableHeader headers={["Name", "Kind", "Namespace"]} />
        <TableBody>
          {filteredData.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.kind}</TableCell>
              <TableCell>{item.metadata?.namespace}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
