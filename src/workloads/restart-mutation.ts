import type { V1StatefulSet, V1Deployment } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

export function restartMutation(resourceType: "deployment" | "stateful_set") {
  return useMutation({
    mutationFn: (resource: V1Deployment | V1StatefulSet) => {
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
