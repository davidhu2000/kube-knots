import { type V1Pod } from "@kubernetes/client-node";

import Drawer from "../components/drawer";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export default function PodEdit({ isOpen, selectedPod, handleClose }: PodLogsProps) {
  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedPod?.metadata?.name ?? ""}
      description={`Container: {selectedPod?.spec?.containers[0].name}`}
    >
      <pre className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm text-gray-500">
        {JSON.stringify(selectedPod)}
      </pre>
    </Drawer>
  );
}
