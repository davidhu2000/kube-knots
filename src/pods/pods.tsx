import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentNamespace } from "../namespaces/namespaces";

const noPod = {
  metadata: {
    uid: "no-pods-found",
    name: "No pod found",
  },
  status: {
    phase: "---",
  },
};

export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const pods = result.data?.items?.length ? result.data?.items : [noPod];

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300 rounded-md">
        <thead className="bg-gray-200">
          <tr>
            {["Name", "Status"].map((header) => (
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {pods.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                {pod.metadata?.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                {pod.status?.phase}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
