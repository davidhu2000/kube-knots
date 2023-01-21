import { Dialog } from "@headlessui/react";
import { V1ReplicaSet, V1StatefulSet, type V1Deployment } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";

interface ModalProps<T> {
  isOpen: boolean;
  handleClose: () => void;
  deployment: T;
}
export function ScaleModal<T extends V1Deployment | V1ReplicaSet | V1StatefulSet>({
  isOpen,
  handleClose,
  deployment,
}: ModalProps<T>): JSX.Element {
  const [replicas, setReplicas] = useState<number>(deployment.spec?.replicas || 0);

  const scaleMutation = useMutation({
    mutationFn: (replicas: number) => {
      return invoke("scale_deployment", {
        namespace: deployment.metadata?.namespace,
        name: deployment.metadata?.name,
        replicas,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      alert(`Scaled deployment ${deployment.metadata?.name} to ${variables} replicas`);
    },
  });

  return (
    <Dialog as="div" className="relative z-10" onClose={handleClose} open={isOpen}>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative rounded-lg bg-gray-100 p-4 text-left shadow-xl">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              Scale {deployment.metadata?.name}
            </Dialog.Title>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Current replica count: {deployment.spec?.replicas}
              </p>
            </div>

            <input
              onChange={(e) => setReplicas(parseInt(e.target.value ?? ""))}
              type="number"
              value={replicas}
              className="mt-4 block w-full rounded-md border-gray-300 focus:ring-slate-500"
              step={1}
              min={0}
            />

            <button
              className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 text-base text-gray-800 shadow-sm hover:bg-gray-300"
              onClick={() => scaleMutation.mutate(replicas)}
            >
              Scale
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
