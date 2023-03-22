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
  V1StatefulSet,
  V1Service,
  V1Secret,
  V1ReplicationController,
} from "@kubernetes/client-node";

import { useResourceList } from "./use-resource-list";

export function useWorkloadResources() {
  const cronjobsQuery = useResourceList<V1CronJob>("get_cron_jobs");
  const daemonSetsQuery = useResourceList<V1DaemonSet>("get_daemon_sets");
  const deploymentsQuery = useResourceList<V1Deployment>("get_deployments");
  const jobsQuery = useResourceList<V1Job>("get_jobs");
  const podsQuery = useResourceList<V1Pod>("get_pods");
  const replicasetsQuery = useResourceList<V1ReplicaSet>("get_replica_sets");
  const replicationControllersQuery = useResourceList<V1ReplicationController>(
    "get_replication_controllers"
  );
  const statefulsetsQuery = useResourceList<V1StatefulSet>("get_stateful_sets");

  return [
    ...(cronjobsQuery.data?.items ?? []),
    ...(daemonSetsQuery.data?.items ?? []),
    ...(deploymentsQuery.data?.items ?? []),
    ...(jobsQuery.data?.items ?? []),
    ...(podsQuery.data?.items ?? []),
    ...(replicasetsQuery.data?.items ?? []),
    ...(replicationControllersQuery.data?.items ?? []),
    ...(statefulsetsQuery.data?.items ?? []),
  ];
}

export function useNetworkingResources() {
  const ingressesQuery = useResourceList<V1Ingress>("get_ingresses");
  const servicesQuery = useResourceList<V1Service>("get_services");

  return [...(ingressesQuery.data?.items ?? []), ...(servicesQuery.data?.items ?? [])];
}

export function useConfigResources() {
  const configMapsQuery = useResourceList<V1ConfigMap>("get_config_maps");
  const hpasQuery = useResourceList<V1HorizontalPodAutoscaler>("get_horizontal_pod_autoscalers");
  const secretsQuery = useResourceList<V1Secret>("get_secrets");

  return [
    ...(configMapsQuery.data?.items ?? []),
    ...(hpasQuery.data?.items ?? []),
    ...(secretsQuery.data?.items ?? []),
  ];
}

export function useMultiResourceList() {
  const workloads = useWorkloadResources();
  const networking = useNetworkingResources();
  const config = useConfigResources();

  return [...workloads, ...networking, ...config];
}
