import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { camelToSnakeCase } from "../helpers/casing-helpers";
import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./modal";
import { type ResourceBase } from "./resource-table";

interface ResourceRestartModalProps<T> {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: T | null;
}
export function ResourceRestartModal<T extends ResourceBase>({
  isOpen,
  handleClose,
  selectedResource,
}: ResourceRestartModalProps<T>): JSX.Element {
  const { currentContext } = useCurrentContext();

  const restartMutation = useMutation({
    mutationFn: (resource: T) => {
      return invoke<boolean>(`restart_${camelToSnakeCase(resource.kind)}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
      });
    },
    onSuccess: (_data, variables) => {
      toast.success(`Restarted ${variables.kind}: ${variables.metadata?.name}`);
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
      title={`Restart ${selectedResource?.metadata?.name}`}
    >
      {selectedResource ? (
        <>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">Restart resource?</p>
          </div>

          <ModalButton label="Restart" onClick={() => restartMutation.mutate(selectedResource)} />
        </>
      ) : (
        <div>Missing Resource to Restart</div>
      )}
    </BaseModal>
  );
}
