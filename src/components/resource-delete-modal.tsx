import { type V1Pod } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./base/modal";

interface ResourceDeleteProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: V1Pod | null;
}
export function ResourceDeleteModal({
  isOpen,
  handleClose,
  selectedResource,
}: ResourceDeleteProps): JSX.Element {
  const { currentContext } = useCurrentContext();
  const type = selectedResource?.kind?.toLowerCase() ?? "--";

  const deleteMutation = useMutation({
    mutationFn: (resource: V1Pod) => {
      return invoke<boolean>(`delete_${type}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        podName: resource.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      toast.success(`Deleted ${type.replace("_", " ")} ${variables.metadata?.name}`);
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title={`Delete ${type}`}>
      {selectedResource ? (
        <>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Confirming delete of &quot;{selectedResource.metadata?.name}&quot;
            </p>
          </div>

          <ModalButton label="Delete" onClick={() => deleteMutation.mutate(selectedResource)} />
        </>
      ) : (
        <div>Missing Resource to delete</div>
      )}
    </BaseModal>
  );
}
