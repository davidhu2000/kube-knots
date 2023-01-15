import { BarsArrowDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import type { V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { type PropsWithChildren, useState } from "react";

import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useCurrentNamespace } from "../namespaces/namespaces";
import PodLogs from "./pod-logs";

function ActionGroup({ children }: PropsWithChildren) {
  return <span className="isolate inline-flex rounded-md shadow-sm">{children}</span>;
}

function ActionButton({
  Icon,
  label,
  position,
  onClick,
}: {
  Icon: typeof PencilIcon;
  label: string;
  position: "left" | "right" | "middle";
  onClick: () => void;
}) {
  const roundedClass =
    position === "left" ? "rounded-l-md" : position === "right" ? "rounded-r-md" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${
        position === "left" ? "" : "-ml-px"
      } inline-flex items-center ${roundedClass} border border-gray-300 p-2 hover:bg-gray-50`}
    >
      <Icon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      {label}
    </button>
  );
}

export function Pods() {
  const { namespace } = useCurrentNamespace();

  const result = useQuery(["pods", namespace], () => {
    return invoke<{ items: V1Pod[] }>("get_pods", { namespace });
  });

  const pods = result.data?.items ?? [];

  const [selectedPod, setSelectedPod] = useState<V1Pod | null>(null);

  const handleSelectPod = (pod: V1Pod) => {
    setSelectedPod(pod);
  };

  const handleLogPanelClose = () => setSelectedPod(null);

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Status", "Actions"]} />
        <TableBody>
          {pods.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <TableCell>{pod.metadata?.name}</TableCell>
              <TableCell>{pod.status?.phase}</TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    Icon={BarsArrowDownIcon}
                    label="Logs"
                    position="left"
                    onClick={() => handleSelectPod(pod)}
                  />
                  <ActionButton
                    Icon={PencilIcon}
                    label="Edit"
                    position="right"
                    onClick={() => alert("Edit")}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
      <PodLogs isOpen={!!selectedPod} handleClose={handleLogPanelClose} selectedPod={selectedPod} />
    </div>
  );
}
