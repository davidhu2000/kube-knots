import { Switch } from "@headlessui/react";
import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

import { useTheme } from "../hooks/use-theme";
import { Drawer } from "./drawer";

interface ResourceEditDrawerProps<T> {
  isOpen: boolean;
  selectedResource: T | null;
  handleClose: () => void;
}

export function ResourceEditDrawer<T extends { metadata?: V1ObjectMeta }>({
  isOpen,
  selectedResource,
  handleClose,
}: ResourceEditDrawerProps<T>) {
  const [code, setCode] = useState<string>(JSON.stringify(selectedResource, null, 4));

  const [showDiff, setShowDiff] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setCode(JSON.stringify(selectedResource, null, 4));
    setShowDiff(false);
  }, [selectedResource]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedResource?.metadata?.name ?? ""}
      description={
        <Switch.Group as="div" className="flex items-center">
          <Switch
            checked={showDiff}
            onChange={setShowDiff}
            className={`${
              showDiff ? "bg-blue-600 dark:bg-blue-300" : "bg-gray-200 dark:bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Show Diff</span>
            <span
              className={`${
                showDiff ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 rounded-full bg-white transition`}
            />
          </Switch>
          <Switch.Label as="span" className="ml-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Diff Toggle
            </span>
          </Switch.Label>
        </Switch.Group>
      }
    >
      {showDiff ? (
        <DiffEditor
          language="json"
          original={JSON.stringify(selectedResource, null, 4)}
          theme={theme === "dark" ? "vs-dark" : "light"}
          modified={code}
        />
      ) : (
        <Editor
          defaultLanguage="json"
          defaultValue={code}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onChange={(code) => setCode(code ?? "")}
        />
      )}
    </Drawer>
  );
}
