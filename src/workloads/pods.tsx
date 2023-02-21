import type { V1Pod } from "@kubernetes/client-node";
import { lazy, Suspense, useState } from "react";

import { ActionButton, ActionGroup } from "../components/action-group";
import { Drawer } from "../components/drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";
import { useScrollBottom } from "../hooks/use-scroll-bottom";

const PodLogs = lazy(() => import("./pod-logs").then((module) => ({ default: module.PodLogs })));

const ResourceEditDrawer = lazy(() =>
  import("../components/resource-edit-drawer").then((module) => ({
    default: module.ResourceEditDrawer,
  }))
);

function Terminal() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  function handleCommand(event) {
    event.preventDefault();
    // process the command and add the output to the output state
    setOutput((prevOutput) => [...prevOutput, `> ${command}`, `Output for ${command}`]);
    setCommand("");
  }

  const bottomRef = useScrollBottom([output]);

  function handleInputChange(event) {
    setCommand(event.target.value);
  }

  return (
    <div className="h-full w-full overflow-scroll rounded-lg bg-gray-100 p-4 text-gray-900 dark:bg-black dark:text-gray-100">
      {output.map((line, index) => (
        <p key={index} className="mb-2">
          {line}
        </p>
      ))}
      <form onSubmit={handleCommand} className="flex w-full">
        <span className="text-green-600 dark:text-green-400">{">"}</span>
        <input
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
  const {
    data: { items },
  } = useResourceList<V1Pod>("get_pods");

  const { selected, handleOpen, handleClose, action } = useResourceActions<
    V1Pod,
    "edit" | "exec" | "logs"
  >();

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Status", "Actions"]} />
        <TableBody>
          {items.map((pod) => (
            <tr key={pod.metadata?.uid}>
              <TableCell>{pod.metadata?.name}</TableCell>
              <TableCell>{pod.status?.phase}</TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    label="logs"
                    position="left"
                    onClick={() => handleOpen(pod, "logs")}
                  />
                  <ActionButton
                    label="exec"
                    position="middle"
                    onClick={() => handleOpen(pod, "exec")}
                  />
                  <ActionButton
                    label="edit"
                    position="right"
                    onClick={() => handleOpen(pod, "edit")}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
      <Suspense fallback={<div>Loading Logs</div>}>
        <PodLogs isOpen={action === "logs"} handleClose={handleClose} selectedPod={selected} />
      </Suspense>
      <Suspense fallback={<div>Loading Form</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>
      <Suspense fallback={<div>Loading Drawer</div>}>
        <Drawer
          isOpen={action === "exec"}
          handleClose={handleClose}
          title="Terminal"
          // TODO: support multiple containers
          description={`Terminal for ${selected?.metadata?.name} - ${selected?.spec?.containers[0]?.name}`}
        >
          <Terminal />
        </Drawer>
      </Suspense>
    </div>
  );
}
