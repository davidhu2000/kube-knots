import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { PathnameTitle } from "../components/pathname-title";
import { useNetworkingResources } from "../hooks/use-multi-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";

export function NetworkingOverview() {
  const data = useNetworkingResources();

  const { filteredData, handleSearch, search } = useSearch({
    data,
  });

  return (
    <div>
      <div className="flex justify-between">
        <PathnameTitle />

        <SearchInput onChange={handleSearch} value={search} />
      </div>
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
