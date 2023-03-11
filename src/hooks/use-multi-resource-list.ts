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
    data: { items: replicationControllers },
  } = useResourceList<V1ReplicationController>("get_replication_controllers");
  const {
    data: { items: statefulsets },
  } = useResourceList<V1StatefulSet>("get_stateful_sets");

  return [
    ...cronjobs,
    ...daemonSets,
    ...deployments,
    ...jobs,
    ...pods,
    ...replicasets,
    ...replicationControllers,
    ...statefulsets,
  ];
}

export function useNetworkingResources() {
  const {
    data: { items: ingresses },
  } = useResourceList<V1Ingress>("get_ingresses");
  const {
    data: { items: services },
  } = useResourceList<V1Service>("get_services");

  return [...ingresses, ...services];
}

export function useConfigResources() {
  const {
    data: { items: configmaps },
  } = useResourceList<V1ConfigMap>("get_config_maps");
  const {
    data: { items: hpas },
  } = useResourceList<V1HorizontalPodAutoscaler>("get_horizontal_pod_autoscalers");
  const {
    data: { items: secrets },
  } = useResourceList<V1Secret>("get_secrets");

  return [...configmaps, ...hpas, ...secrets];
}

export function useMultiResourceList() {
  const workloads = useWorkloadResources();
  const networking = useNetworkingResources();
  const config = useConfigResources();

  return [...workloads, ...networking, ...config];
}
