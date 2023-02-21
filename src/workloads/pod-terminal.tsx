import { type V1Pod } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { useState, useRef, type ChangeEvent, useEffect } from "react";

import { useScrollBottom } from "../hooks/use-scroll-bottom";

let socket: WebSocket;

export function PodTerminal({ pod }: { pod: V1Pod }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  const podName = pod.metadata?.name;
  const namespace = pod.metadata?.namespace;
  const container = pod.spec?.containers[0].name;

  const execMutation = useMutation({
    mutationFn: () => {
      return invoke<number>(`exec_pod`, {
        namespace,
        podName,
        container,
      });
    },
    onSuccess: (data) => {
      socket = new WebSocket(`ws://127.0.0.1:${data}`);

      // socket.addEventListener("open", (event) => {
      //   console.log("Connected to WebSocket server!");
      //   socket.send("test");
      // });

      socket.onopen = (event) => {
        console.log("Connected to WebSocket server!");
        // socket.send("test");
      };

      socket.onclose = (event) => {
        console.log("WebSocket server closed.");
      };

      socket.onmessage = (event) => {
        console.log("Received message:", event.data);
      };

      socket.onerror = (event) => {
        console.log("WebSocket error:", event);
      };

      // socket.addEventListener("message", (event) => {
      //   console.log("Received message:", event.data);
      // });

      // socket.addEventListener("close", (event) => {
      //   console.log("WebSocket server closed.");
      // });
    },
  });

  useEffect(() => {
    execMutation.mutate();
  }, []);

  function handleCommand(event) {
    event.preventDefault();
    // process the command and add the output to the output state
    // setOutput((prevOutput) => [...prevOutput, `> ${command}`, `Output for ${command}`]);
    // execMutation.mutate(command);
    if (command === "close") {
      socket.close();
      return;
    }

    socket.send(command);

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

  // function handleContainerClick() {
  //   inputRef.current?.focus();
  // }

  return (
    <div
      className="h-full w-full overflow-scroll rounded-lg bg-gray-200 p-4 text-gray-900 dark:bg-black dark:text-gray-100"
      // onClick={handleContainerClick}
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
