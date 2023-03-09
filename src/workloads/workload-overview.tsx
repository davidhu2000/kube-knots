import type {
  V1CronJob,
  V1DaemonSet,
  V1Deployment,
  V1Job,
  V1Pod,
  V1ReplicaSet,
  V1StatefulSet,
} from "@kubernetes/client-node";

import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { PathnameTitle } from "../components/pathname-title";
import { useResourceList } from "../hooks/use-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";

export function WorkloadOverview() {
  const {
    data: { items: cronjobs },
  } = useResourceList<V1CronJob>("get_cron_jobs");
  const {
    data: { items: daemonSets },
  } = useResourceList<V1DaemonSet>("get_daemon_sets");
  const {
    data: { items: deployments },
  } = useResourceList<V1Deployment>("get_deployments");

  const {
    data: { items: jobs },
  } = useResourceList<V1Job>("get_jobs");

  const {
    data: { items: pods },
  } = useResourceList<V1Pod>("get_pods");

  const {
    data: { items: replicasets },
  } = useResourceList<V1ReplicaSet>("get_replica_sets");

  const {
    data: { items: statefulsets },
  } = useResourceList<V1StatefulSet>("get_stateful_sets");

  const data = [
    ...cronjobs,
    ...daemonSets,
    ...deployments,
    ...jobs,
    ...pods,
    ...replicasets,
    ...statefulsets,
  ];

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
