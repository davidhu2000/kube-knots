import type {
  V1ConfigMap,
  V1CronJob,
  V1DaemonSet,
  V1Deployment,
  V1HorizontalPodAutoscaler,
  V1Ingress,
  V1Job,
  V1Pod,
  V1ReplicaSet,
  V1ReplicationController,
  V1Secret,
  V1Service,
  V1StatefulSet,
} from "@kubernetes/client-node";

import { Table, TableBody, TableCell, TableHeader } from "../components/base/table";
import { PathnameTitle } from "../components/pathname-title";
import { useResourceList } from "../hooks/use-resource-list";
import { SearchInput, useSearch } from "../hooks/use-search";

export function ResourcesOverview() {
  const configMapsQuery = useResourceList<V1ConfigMap>("get_config_maps");
  const cronjobsQuery = useResourceList<V1CronJob>("get_cron_jobs");
  const daemonSetsQuery = useResourceList<V1DaemonSet>("get_daemon_sets");
  const deploymentsQuery = useResourceList<V1Deployment>("get_deployments");
  const hpasQuery = useResourceList<V1HorizontalPodAutoscaler>("get_horizontal_pod_autoscalers");
  const ingressesQuery = useResourceList<V1Ingress>("get_ingresses");
  const jobsQuery = useResourceList<V1Job>("get_jobs");
  const podsQuery = useResourceList<V1Pod>("get_pods");
  const replicasetsQuery = useResourceList<V1ReplicaSet>("get_replica_sets");
  const statefulsetsQuery = useResourceList<V1StatefulSet>("get_stateful_sets");
  const replicationControllersQuery = useResourceList<V1ReplicationController>(
    "get_replication_controllers"
  );
  const servicesQuery = useResourceList<V1Service>("get_services");
  const secretsQuery = useResourceList<V1Secret>("get_secrets");

  const data = [
    ...(configMapsQuery.data?.items ?? []),
    ...(cronjobsQuery.data?.items ?? []),
    ...(daemonSetsQuery.data?.items ?? []),
    ...(deploymentsQuery.data?.items ?? []),
    ...(hpasQuery.data?.items ?? []),
    ...(ingressesQuery.data?.items ?? []),
    ...(jobsQuery.data?.items ?? []),
    ...(podsQuery.data?.items ?? []),
    ...(replicasetsQuery.data?.items ?? []),
    ...(replicationControllersQuery.data?.items ?? []),
    ...(statefulsetsQuery.data?.items ?? []),
    ...(servicesQuery.data?.items ?? []),
    ...(secretsQuery.data?.items ?? []),
  ];

  const { filteredData, handleSearch, search } = useSearch({ data });

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
