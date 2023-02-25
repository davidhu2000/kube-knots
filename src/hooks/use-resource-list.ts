import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";

type Commands =
  | "get_cron_jobs"
  | "get_deployments"
  | "get_events"
  | "get_ingresses"
  | "get_jobs"
  | "get_node_metrics"
  | "get_nodes"
  | "get_pod_metrics"
  | "get_pods"
  | "get_replica_sets"
  | "get_services"
  | "get_stateful_sets";

export function useResourceList<T>(command: Commands) {
  const { namespace } = useCurrentNamespace();
  const result = useQuery(
    [command, namespace],
    () => {
      return invoke<{ items: T[] }>(command, { namespace });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000 }
  );

  return { ...result, data: result.data ?? { items: [] } };
}
