import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";
import { useCurrentContext } from "../providers/current-context-provider";

type Commands = "get_config";

export function useResource<T>(command: Commands) {
  const { namespace } = useCurrentNamespace();
  const { currentContext } = useCurrentContext();
  const result = useQuery(
    [command, namespace],
    () => {
      return invoke<T>(command, { namespace, context: currentContext });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000 }
  );

  return result;
}
