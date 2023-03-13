import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import type { V1Node, V1Pod } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { BaseModal, ModalButton } from "../components/base/modal";
import { useCurrentContext } from "../providers/current-context-provider";

interface NodeDrainModalProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: V1Node | null;
  pods: V1Pod[];
}

function evictPod(pod: V1Pod, context: string | null) {
  return invoke<boolean>(`evict_pod`, {
    context: context,
    namespace: pod.metadata?.namespace,
    name: pod.metadata?.name,
  });
}

export function NodeDrainModal({
  isOpen,
  handleClose,
  selectedResource,
  pods,
}: NodeDrainModalProps): JSX.Element {
  const { currentContext } = useCurrentContext();

  const podsOnNode = pods.filter((pod) => pod.spec?.nodeName === selectedResource?.metadata?.name);

  const cordonMutation = useMutation({
    mutationFn: () => {
      return Promise.all(podsOnNode.map((pod) => evictPod(pod, currentContext)));
    },
    onSuccess: () => {
      toast.success(`Drained noded: ${selectedResource?.metadata?.name}`);
      handleClose();
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={`Drain ${selectedResource?.metadata?.name}`}
    >
      {selectedResource ? (
        <>
          <div className="mt-2">
            <p className="text-sm capitalize text-gray-500 dark:text-gray-300">Drain node?</p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              <ExclamationCircleIcon className="inline h-5 w-5 text-red-500" /> This action will
              gracefully terminate all pods on the node.
            </p>
          </div>

          <ModalButton label={"Drain"} onClick={() => cordonMutation.mutate()} />
        </>
      ) : (
        <div>Missing Node to drain</div>
      )}
    </BaseModal>
  );
}
