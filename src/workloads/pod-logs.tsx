import { type V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useEffect, useRef } from "react";

import { Drawer } from "../components/drawer";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export function PodLogs({ isOpen, selectedPod, handleClose }: PodLogsProps) {
  const podName = selectedPod?.metadata?.name;
  const namespace = selectedPod?.metadata?.namespace;
  const container = selectedPod?.spec?.containers[0].name;

  const result = useQuery(
    ["pod-logs", podName],
    () => {
      return invoke<string>("get_pod_logs", {
        podName: podName,
        namespace,
        container,
      });
    },
    { enabled: !!podName, refetchInterval: 5000 }
  );

  const logBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result.data]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedPod?.metadata?.name ?? ""}
      description={`Container: ${selectedPod?.spec?.containers[0].name}`}
    >
      <pre className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        {result.data}
        <div ref={logBottomRef} />
      </pre>
    </Drawer>
  );
}
