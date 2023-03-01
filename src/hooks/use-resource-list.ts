import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentContext } from "../providers/current-context-provider";
import { useNamespace } from "../providers/namespaces-provider";

type Commands =
  | "get_config_maps"
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
  | "get_secrets"
  | "get_services"
  | "get_stateful_sets";

export function useResourceList<T>(command: Commands) {
  const { currentNamespace } = useNamespace();
  const { currentContext } = useCurrentContext();
  const result = useQuery(
    [command, currentContext, currentNamespace],
    () => {
      return invoke<{ items: T[] }>(command, {
        namespace: currentNamespace,
        context: currentContext,
      });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000, onError: (error) => console.error(error) }
  );

  return { ...result, data: result.data ?? { items: [] } };
}
