import { ResourceList } from "./shared/resource-list";

export function Deployments() {
  return (
    <ResourceList
      resourceName="deployment"
      actions={["edit", "scale", "restart"]}
      headers={["Name", "Image", "Pods"]}
    />
  );
}
