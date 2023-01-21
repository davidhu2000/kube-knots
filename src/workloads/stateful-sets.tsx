import { lazy } from "react";

import { ResourceList } from "./shared/resource-list";

export function StatefulSets() {
  return (
    <ResourceList
      resourceName="stateful_set"
      actions={["edit", "scale", "logs"]}
      headers={["Name", "Image", "Pods"]}
    />
  );
}
