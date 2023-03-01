import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { type V1Pod } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

import { Drawer } from "../components/drawer";
import { ToggleButton } from "../components/toggle-button";
import { useScrollBottom } from "../hooks/use-scroll-bottom";
import { useCurrentContext } from "../providers/current-context-provider";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export function PodLogs({ isOpen, selectedPod, handleClose }: PodLogsProps) {
  const podName = selectedPod?.metadata?.name;
  const namespace = selectedPod?.metadata?.namespace;
  const [container, setContainer] = useState(selectedPod?.spec?.containers[0].name);
  const { currentContext } = useCurrentContext();

  const [followLogs, setFollowLogs] = useState(true);

  const handleFollowLogs = (followLogs: boolean) => {
    setFollowLogs(followLogs);
  };

  useEffect(() => {
    setContainer(selectedPod?.spec?.containers[0].name);
  }, [selectedPod]);

  const result = useQuery(
    ["pod-logs", currentContext, namespace, podName, container],
    () => {
      return invoke<string>("get_pod_logs", {
        podName: podName,
        namespace,
        container,
        context: currentContext,
      });
    },
    { enabled: !!podName, refetchInterval: 1000 }
  );

  const logBottomRef = useScrollBottom([result.data, followLogs]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedPod?.metadata?.name ?? ""}
      description={
        <div className="flex gap-4">
          <Listbox value={container} onChange={(e) => setContainer(e)}>
            <div className="relative z-10 w-60">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left shadow-md dark:bg-gray-900">
                <span className="block truncate">{container}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded-md bg-gray-100 text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100">
                {selectedPod?.spec?.containers.map((container, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={`relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-gray-200 dark:hover:bg-gray-800`}
                    value={container.name}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate`}>{container.name}</span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <ToggleButton
            checked={followLogs}
            onChange={handleFollowLogs}
            checkedLabel="Follow Logs"
            uncheckedLabel="Follow Logs"
          />
        </div>
      }
    >
      <pre className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        {result.data}
        {followLogs && <div ref={logBottomRef} />}
      </pre>
    </Drawer>
  );
}
