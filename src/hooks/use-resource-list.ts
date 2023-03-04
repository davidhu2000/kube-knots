import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { useCurrentContext } from "../providers/current-context-provider";
import { useNamespace } from "../providers/namespaces-provider";

export type ResourceListCommands =
  | "get_config_maps"
  | "get_cron_jobs"
  | "get_daemon_sets"
  | "get_deployments"
  | "get_events"
  | "get_horizontal_pod_autoscalers"
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

export function useResourceList<T>(command: ResourceListCommands) {
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
    { onError: (error) => toast.error(error as string) }
  );

  return { ...result, data: result.data ?? { items: [] } };
}
