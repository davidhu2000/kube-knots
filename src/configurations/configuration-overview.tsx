import type { V1ConfigMap, V1HorizontalPodAutoscaler, V1Secret } from "@kubernetes/client-node";

import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { PathnameTitle } from "../components/pathname-title";
import { formatPathnameAsTitle } from "../helpers/casing-helpers";
import { useResourceList } from "../hooks/use-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";

export function ConfigurationOverview() {
  const {
    data: { items: configMaps },
  } = useResourceList<V1ConfigMap>("get_config_maps");

  const {
    data: { items: hpas },
  } = useResourceList<V1HorizontalPodAutoscaler>("get_horizontal_pod_autoscalers");

  const {
    data: { items: secrets },
  } = useResourceList<V1Secret>("get_secrets");

  const data = [...configMaps, ...hpas, ...secrets];

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
