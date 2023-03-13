import type { V1Container } from "@kubernetes/client-node";

export function renderContainerImages(containers?: V1Container[]) {
  if (!containers) {
    return null;
  }

  return [...new Set(containers.map((c) => c.image))].map((image) => {
    return <p key={image}>{image}</p>;
  });
}
