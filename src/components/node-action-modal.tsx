import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import type { V1Node } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./base/modal";

interface NodeActionModalProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: V1Node | null;
  action: "cordon" | "uncordon";
}
export function NodeActionModal({
  isOpen,
  handleClose,
  selectedResource,
  action,
}: NodeActionModalProps): JSX.Element {
  const { currentContext } = useCurrentContext();

  const cordonMutation = useMutation({
    mutationFn: (resource: V1Node) => {
      return invoke<boolean>(`${action}_node`, {
        context: currentContext,
        name: resource.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      toast.success(`${action}ed ${variables.kind}: ${variables.metadata?.name}`);
      handleClose();
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  if (action === null) {
    return <></>;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={`${action} ${selectedResource?.metadata?.name}`}
    >
      {selectedResource ? (
        <>
          <div className="mt-2">
            <p className="text-sm capitalize text-gray-500 dark:text-gray-300">{action} node?</p>

            {action === "cordon" && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                <ExclamationCircleIcon className="inline h-5 w-5 text-red-500" /> No more pods will
                be scheduled on the node
              </p>
            )}
          </div>

          <ModalButton label={action} onClick={() => cordonMutation.mutate(selectedResource)} />
        </>
      ) : (
        <div>Missing Node to {action}</div>
      )}
    </BaseModal>
  );
}
