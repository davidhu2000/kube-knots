import type { PodMetric, V1Pod } from "@kubernetes/client-node";
import { type ColumnDef } from "@tanstack/react-table";
import { type ChangeEvent, useEffect, useRef, useState, type FormEvent, useMemo } from "react";

import { TableCell } from "../components/base/table";
import { ResourceTable } from "../components/resource-table";
import { CpuUsage, MemoryUsage } from "../components/resource-usage";
import { useResourceList } from "../hooks/use-resource-list";
import { useScrollBottom } from "../hooks/use-scroll-bottom";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Terminal() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  function handleCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // process the command and add the output to the output state
    setOutput((prevOutput) => [...prevOutput, `> ${command}`, `Output for ${command}`]);
    setCommand("");
  }

  const bottomRef = useScrollBottom([output]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCommand(event.target.value);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleContainerClick() {
    inputRef.current?.focus();
  }

  return (
    <div
      className="h-full w-full overflow-scroll rounded-lg bg-gray-200 p-4 text-gray-900 dark:bg-black dark:text-gray-100"
      onClick={handleContainerClick}
    >
      {output.map((line, index) => (
        <p key={index} className="mb-2">
          {line}
        </p>
      ))}
      <form onSubmit={handleCommand} className="flex w-full">
        <span className="text-green-600 dark:text-green-400">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={handleInputChange}
          className="ml-1 flex-1 grow border-none bg-transparent p-0 focus:outline-none focus:ring-0"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}

export function Pods() {
  const podMetricsQuery = useResourceList<PodMetric>("get_pod_metrics");
  const metrics = podMetricsQuery.data?.items ?? [];

  const columns = useMemo<ColumnDef<V1Pod>[]>(
    () => [
      {
        accessorFn: (row) => row.metadata?.name,
        header: "Name",
        size: 60,
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.status?.phase,
        header: "Phase",
        size: 60,
      },
      // {
      //   accessorFn: (row) => row.status?.phase,
      //   header: "CPU",
      //   size: 60,
      // },

      // {
      //   accessorFn: (row) => row.metadata?.namespace,
      //   id: "lastName",
      //   cell: (info) => info.getValue(),
      //   header: () => <span>Last Name</span>,
      // },
    ],
    []
  );

  return (
    <ResourceTable<V1Pod>
      command="get_pods"
      headers={["Name", "Status", "CPU", "Memory"]}
      actions={["logs", "edit", "delete"]}
      columns={columns}
      renderData={(item) => {
        const metric = metrics.find((metric) => metric.metadata.name === item.metadata?.name);

        // TODO: handle multiple containers
        const usage = metric?.containers[0].usage;
        const requests = item.spec?.containers[0].resources?.requests;

        return (
          <>
            <TableCell>{item.metadata?.name}</TableCell>
            <TableCell>{item.status?.phase}</TableCell>
            <TableCell>
              <CpuUsage usage={usage?.cpu} request={requests?.cpu} simpleLabel={true} />
            </TableCell>
            <TableCell>
              <MemoryUsage usage={usage?.memory} request={requests?.memory} simpleLabel={true} />
            </TableCell>
          </>
        );
      }}
    />
  );
}
