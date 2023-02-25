import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";

type Commands = "get_config";

export function useResource<T>(command: Commands) {
  const { namespace } = useCurrentNamespace();
  const result = useQuery(
    [command, namespace],
    () => {
      return invoke<T>(command, { namespace });
    },
    // TODO: maybe make this configurable?
    { refetchInterval: 2000 }
  );

  return result;
}
