import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentContext } from "../providers/current-context-provider";
import { useNamespace } from "../providers/namespaces-provider";

type Commands = "get_config";

export function useResource<T>(command: Commands) {
  const { currentNamespace } = useNamespace();
  const { currentContext } = useCurrentContext();
  const result = useQuery(
    [command, currentContext, currentNamespace],
    () => {
      return invoke<T>(command, { namespace: currentNamespace, context: currentContext });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000 }
  );

  return result;
}
