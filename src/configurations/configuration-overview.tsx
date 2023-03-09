import type { V1ConfigMap, V1HorizontalPodAutoscaler, V1Secret } from "@kubernetes/client-node";

import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { useResourceList } from "../hooks/use-resource-list";

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

  return (
    <Table>
      <TableHeader headers={["Name", "Kind", "Namespace"]} />
      <TableBody>
        {data.map((item) => (
          <tr key={item.metadata?.uid}>
            <TableCell>{item.metadata?.name}</TableCell>
            <TableCell>{item.kind}</TableCell>
            <TableCell>{item.metadata?.namespace}</TableCell>
          </tr>
        ))}
      </TableBody>
    </Table>
  );
}
