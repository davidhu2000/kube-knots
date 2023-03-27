import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import type { V1Pod, V1Job } from "@kubernetes/client-node";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useScrollBottom } from "../hooks/use-scroll-bottom";
import { useCurrentContext } from "../providers/current-context-provider";
import { Drawer } from "./base/drawer";
import { ToggleButton } from "./base/toggle-button";

interface PodLogsProps {
  isOpen: boolean;
  selected: V1Job | V1Pod | null;
  handleClose: () => void;
}

function isPod(resource: V1Job | V1Pod | null): resource is V1Pod {
  return (resource as V1Pod)?.kind === "Pod";
}

export function PodLogs({ isOpen, selected, handleClose }: PodLogsProps) {
  const name = selected?.metadata?.name;
  const namespace = selected?.metadata?.namespace;

  const containerName =
    selected && isPod(selected) ? selected?.spec?.containers[0].name : undefined;

  const [container, setContainer] = useState(containerName);
  const { currentContext } = useCurrentContext();

  const [followLogs, setFollowLogs] = useState(true);
  const handleFollowLogs = (followLogs: boolean) => {
    setFollowLogs(followLogs);
  };

  const [search, setSearch] = useState("");
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  useEffect(() => {
    setContainer(isPod(selected) ? selected?.spec?.containers[0].name : undefined);
    setSearch("");
  }, [selected]);

  const command = isPod(selected) ? "get_pod_logs" : "get_job_logs";

  const result = useQuery(
    [command, currentContext, namespace, name, container],
    () => {
      const sharedArgs = {
        namespace,
        context: currentContext,
      };

      const args = isPod(selected)
        ? { container, podName: name }
        : { jobName: selected?.metadata?.labels?.["job-name"] };

      return invoke<string>(command, { ...sharedArgs, ...args });
    },
    {
      enabled: !!name,
      onError: (error) => toast.error(error as string),
      retry: 1,
    }
  );

  const data = result.data?.split("\n") ?? [];

  let filteredData = data.filter((item) => {
    return item.toLowerCase().includes(search.toLowerCase());
  });

  if ((filteredData.length === 1 && filteredData[0] === "") || filteredData.length === 0) {
    filteredData = ["Waiting for logs..."];
  }

  const logBottomRef = useScrollBottom([result.data, followLogs]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selected?.metadata?.name ?? ""}
      description={
        <div className="flex items-center gap-4">
          {isPod(selected) && (
            <Listbox value={container} onChange={(e) => setContainer(e)}>
              <div className="relative z-10 w-60">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left shadow-md dark:bg-gray-800">
                  <span className="block truncate">{container}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded-md bg-gray-100 text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100">
                  {selected?.spec?.containers.map((container, idx) => (
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
          )}

          <ToggleButton
            checked={followLogs}
            onChange={handleFollowLogs}
            checkedLabel="Follow Logs"
            uncheckedLabel="Follow Logs"
          />

          <input
            value={search}
            onChange={handleSearch}
            placeholder="Filter logs"
            className="block h-8 w-40 rounded-md p-2 shadow focus:outline-none dark:bg-gray-800 dark:text-gray-300 sm:text-sm"
          />
        </div>
      }
    >
      <pre className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        {filteredData.join("\n")}
        {followLogs && <div ref={logBottomRef} />}
      </pre>
    </Drawer>
  );
}
