import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";

import { camelToSnakeCase } from "../helpers/casing-helpers";
import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./base/modal";
import type { ResourceBase } from "./resource-table";

interface ResourceDeleteProps<T> {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: T | null;
}
export function ResourceDeleteModal<T extends ResourceBase>({
  isOpen,
  handleClose,
  selectedResource,
}: ResourceDeleteProps<T>): JSX.Element {
  const { currentContext } = useCurrentContext();

  const type = camelToSnakeCase(selectedResource?.kind);

  const deleteMutation = useMutation({
    mutationFn: (resource: T) => {
      return invoke<boolean>(`delete_${type}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              <ExclamationCircleIcon className="inline h-5 w-5 text-red-500" /> This action will
              delete the resource and subresources
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
