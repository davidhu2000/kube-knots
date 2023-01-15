/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { Fragment, useEffect, useRef } from "react";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export default function PodLogs({ isOpen, selectedPod, handleClose }: PodLogsProps) {
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-4xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {selectedPod?.metadata?.name}
                      </Dialog.Title>

                      <Dialog.Description className="text-sm text-gray-500">
                        {/* TODO: update this to be a selector to pick containers */}
                        Container: {selectedPod?.spec?.containers[0].name}
                      </Dialog.Description>

                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="relative h-full flex-1">
                      <div className="absolute inset-0 h-full">
                        <div className="h-full shadow-xl" aria-hidden="true">
                          <pre className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm text-gray-500">
                            {result.data}
                            <div ref={logBottomRef} />
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
