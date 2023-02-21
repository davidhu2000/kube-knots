import type { V1StatefulSet, V1Deployment } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

export function restartMutation(resourceType: "stateful_set" | "deployment") {
  return useMutation({
    mutationFn: (resource: V1StatefulSet | V1Deployment) => {
      return invoke<boolean>(`restart_${resourceType}`, {
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      // TODO: a better way to do this
      alert(`Restarted ${resourceType.replace("_", " ")} ${variables.metadata?.name}`);
    },
  });
}
