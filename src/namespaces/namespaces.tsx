import type { V1Namespace } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

export function Namespaces({ onChange }: { onChange: (namespace: string) => void }) {
  const result = useQuery(["namespaces"], () => {
    return invoke<{ items: V1Namespace[] }>("get_namespaces");
  });

  if (!result.isSuccess) {
    return <div>Error</div>;
  }

  return (
    <select name="namespaces" onChange={(e) => onChange(e.target.value)}>
      <option>All</option>
      {result.data.items.map((item) => (
        <option key={item.metadata?.name} value={item.metadata?.name}>
          {item.metadata?.name}
        </option>
      ))}
    </select>
  );
}
